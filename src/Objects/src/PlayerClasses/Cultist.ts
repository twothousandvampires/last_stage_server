import BurningCircle from "../../../Abilities/Cultist/BurningCircle";
import GhostForm from "../../../Abilities/Cultist/GhostForm";
import GrimPile from "../../../Abilities/Cultist/GrimPile";
import PileOfThornCast from "../../../Abilities/Cultist/PileOfThornCast";
import Rune from "../../../Abilities/Cultist/Rune";
import SelfFlagellation from "../../../Abilities/Cultist/SelfFlagellation";
import ShieldBash from "../../../Abilities/Cultist/ShieldBash";
import Slam from "../../../Abilities/Cultist/Slam";
import SoulShatter from "../../../Abilities/Cultist/SoulShatter";
import UnleashPain from "../../../Abilities/Cultist/UnleashPain";
import Func from "../../../Func";
import Level from "../../../Level";
import Armour from "../../Effects/Armour";
import Blood from "../../Effects/Blood";
import ToothExplode from "../../Effects/ToothExplode";
import Character from "../Character";
import Flyer from "./Flyer";

export default class Cultist extends Character{
    
    static MIN_ATTACK_SPEED = 200
    static MIN_CAST_SPEED = 400
    static MAX_ARMOUR = 95

    resource: number
    max_resource: number
    next_life_regen_time: any
    attack_point_radius: number
    hit_x: number | undefined
    hit_y: number | undefined
    weapon_angle: number
    recent_hits: any
    check_recent_hits_timer: any
    service: boolean
    conduct_of_pain: boolean
    pain_extract: boolean

    constructor(level: Level){
        super(level)

        this.weapon_angle = 1.6
        this.attack_point_radius = 4
        this.attack_radius = 7
        this.attack_speed = 1800
        this.cast_speed = 2000
        this.name = 'cultist'
        this.move_speed = 0.4
        this.avoid_damaged_state_chance = 15
        this.armour_rate = 25
        this.resource = 0
        this.max_resource = 666
        this.hit_x = undefined
        this.hit_y = undefined

        this.life_status = 3
        this.base_regen_time = 9000
        this.service = false
        this.conduct_of_pain = false
        this.pain_extract = false

        this.recent_hits = []
    }

    getSkipDamageStateChance(){
        return this.avoid_damaged_state_chance + this.agility * 3
    }

    getMoveSpeed(): number{
        let total_inc = this.move_speed_penalty
        let speed = this.move_speed + (this.agility / 35)

        if(!total_inc) return speed
        if(total_inc > 100) total_inc = 100
        if(total_inc < -90) total_inc = -90
       
        return speed * (1 + total_inc / 100)
    }

    createAbilities(abilities: any){
        
        let main_name = abilities.find(elem => elem.type === 1 && elem.selected).name

        if(main_name === 'slam'){
            this.first_ab = new Slam(this)
        }
        else if(main_name === 'rune'){
            this.first_ab = new Rune(this)
        }
    
        let secondary_name = abilities.find(elem => elem.type === 2 && elem.selected).name
        
        if(secondary_name === 'shield bash'){
            this.second_ab = new BurningCircle(this)
        }
        else if(secondary_name === 'grim pile'){
            this.second_ab = new GrimPile(this)
        }

        let finisher_name = abilities.find(elem => elem.type === 3 && elem.selected).name

        if(finisher_name === 'unleash pain'){
            this.third_ab = new UnleashPain(this)
        }
        else if(finisher_name === 'pile of thorns'){
            this.third_ab = new PileOfThornCast(this)
        }

        let utility_name = abilities.find(elem => elem.type === 4 && elem.selected).name

        if(utility_name === 'self flagellation'){
            this.utility = new SelfFlagellation(this)
        }
        else if(utility_name === 'ghost form'){
            this.utility = new GhostForm(this)
        }
    }

    addResourse(count: number = 1, ignore_limit = false){
        if(!this.can_regen_resource || !this.can_get_courage) return
        
        for(let i = 0; i < count;i ++){
            this.recent_hits.push(this.time)
        }
    
        if(Func.chance(this.durability * 2)){
            this.recent_hits.push(this.time)
        }

        if(this.can_be_enlighten && this.recent_hits.length >= 12){
            this.can_be_enlighten = false

            this.enlight()

            setTimeout(() => {
                this.can_be_enlighten = true
            }, this.getEnlightenTimer())
        }
    }

    enlight(){
         let count = 10
                
        let zones = 6.28 / count

        for(let i = 1; i <= count; i++){
            let min_a = (i - 1) * zones
            
            let angle = min_a
            let proj = new ToothExplode(this.level)
            proj.setPoint(this.x + (7 * Math.sin(angle)), this.y + (7 * Math.cos(angle)))

            this.level.effects.push(proj)
        }

        this.can_be_damaged = false
        this.armour_rate += 1

        setTimeout(() => {
            this.can_be_damaged = true
        }, 3000)
    }

    subLife(unit: any = undefined, options = {}){
        this.life_status --

        if(this.life_status <= 0){
            this.playerTakeLethalDamage()

            if(this.can_be_lethaled){
                if(options?.explode){
                    this.exploded = true
                }
                unit?.succesefulKill()
                this.is_dead = true
                this.setState(this.setDyingState)
                this.level.playerDead()
            }
            else{
                this.life_status ++
                this.can_be_lethaled = true
            } 
        }   
        else{
            if(!Func.chance(this.getSkipDamageStateChance())){
                this.setState(this.setDamagedAct)
            }
           
            if(this.life_status === 2){
                this.addMoveSpeedPenalty(-5)
            }
            else if(this.life_status === 1){
                this.addMoveSpeedPenalty(-10)
                this.reachNearDead()
            }
        }
    }

    takeDamage(unit:any = undefined, options: any = {}){      
        if(!this.can_be_damaged) return

        if(this.damaged || this.is_dead) return

        if(options?.instant_death){
            unit?.succesefulKill()
            this.is_dead = true
            this.life_status = 0
            this.setState(this.setDyingState)
            this.level.playerDead()
            return
        }

        this.playerWasHited()
        
        let b_chance = 65 + this.durability

        if(b_chance > 90){
            b_chance = 90
        }

        if(this.state === 'defend' && Func.chance(b_chance)){
            this.level.sounds.push({
                name: 'metal hit',
                x: this.x,
                y: this.y
            })

            if(this.conduct_of_pain && Func.chance(50)){
                this.addResourse()
            }
            return
        } 

        this.addResourse()

        let arm = this.armour_rate + this.might
        
        if(arm > Cultist.MAX_ARMOUR){
            arm = Cultist.MAX_ARMOUR
        }

        if(Func.chance(arm)){
            this.level.sounds.push({
                name: 'metal hit',
                x: this.x,
                y: this.y
            })
            let e = new Armour(this.level)
            e.setPoint(Func.random(this.x - 2, this.x + 2), this.y)
            e.z = Func.random(2, 8)
            this.level.effects.push(e)
            return
        }

        this.level.sounds.push({
            name: 'sword hit',
            x: this.x,
            y: this.y
        })
        
        let e = new Blood(this.level)
        e.setPoint(Func.random(this.x - 2, this.x + 2), this.y)
        e.z = Func.random(2, 8)
        this.level.effects.push(e)

        let will_avoid = this.will * 2

        if(will_avoid > 50){
            will_avoid = 50
        }

        if(Func.chance(will_avoid)){
            return
        }

        this.subLife(unit, options)
    }

    getSecondResource(){
        return this.recent_hits.length
    }

    getRegenTimer(){
        return this.base_regen_time - this.speed * 100
    }

    getAllUpgrades(){
        return [
            {
                name: 'runefield',
                type: 'rune',
                canUse: (character: Character) => {
                    return character.first_ab instanceof Rune && !character.first_ab.runefield
                },
                teach: (character: Character) => {
                    if(character.first_ab && character.first_ab instanceof Rune){
                        character.first_ab.runefield = true
                        character.first_ab.cost ++
                    }
                },
                cost: 1,
                desc: 'you will create additional rune for each resourse but now it has coldown for each rune created by this way'
            },
            {
                name: 'explosive runes',
                type: 'rune',
                canUse: (character: Character) => {
                    return character.first_ab instanceof Rune && !character.first_ab.explosive
                },
                teach: (character: Character) => {
                    if(character.first_ab && character.first_ab instanceof Rune){
                        character.first_ab.explosive = true
                        character.first_ab.cost ++
                    }
                },
                cost: 1,
                desc: 'increases radius of explosion'
            },
            {
                name: 'fast detonation',
                type: 'rune',
                canUse: (character: Character) => {
                    return character.first_ab instanceof Rune && !character.first_ab.fast_detonation
                },
                teach: (character: Character) => {
                    if(character.first_ab && character.first_ab instanceof Rune){
                        character.first_ab.fast_detonation = true
                    }
                },
                cost: 1,
                desc: 'increases detonation rate'
            },
            {
                name: 'second detanation',
                type: 'rune',
                canUse: (character: Character) => {
                    return character.first_ab instanceof Rune && !character.first_ab.second_detanation
                },
                teach: (character: Character) => {
                    if(character.first_ab && character.first_ab instanceof Rune){
                        character.first_ab.second_detanation = true
                    }
                },
                cost: 1,
                desc: 'your runes have a chance to explode additional time'
            },
            {
                name: 'soul shatter',
                type: 'new ability',
                canUse: (character: Character) => {
                    return !(character.first_ab instanceof SoulShatter)
                },
                teach: (character: Character) => {
                    character.first_ab = new SoulShatter(this)
                    character.updateClientSkill()
                },
                cost: 1,
                desc: 'hit the single enemy if they died, create a soul projectiles count them based of your resourses'
            },
            {
                name: 'slaming',
                type: 'slam',
                canUse: (character: Character) => {
                    return character.first_ab instanceof Slam && !character.first_ab.slaming
                },
                teach: (character: Character) => {
                    if(character.first_ab && character.first_ab instanceof Slam){
                        character.first_ab.slaming = true
                    }
                },
                cost: 1,
                desc: 'increases the radius of slam hit'
            },
            {
                name: 'soul extraction',
                type: 'slam',
                canUse: (character: Character) => {
                    return character.first_ab instanceof Slam && !character.first_ab.soul_extraction
                },
                teach: (character: Character) => {
                    if(character.first_ab && character.first_ab instanceof Slam){
                        character.first_ab.soul_extraction = true
                    }
                },
                cost: 1,
                desc: 'increases the chance to get grace from killing enemies'
            },
            {
                name: 'deafening wave',
                type: "shield bash",
                canUse: (character: Character) => {
                    return character.second_ab instanceof ShieldBash &&
                    !character.second_ab.deafening_wave &&
                    !character.second_ab.hate

                },
                teach: (character: Character) => {
                    if(character.second_ab && character.second_ab instanceof ShieldBash){
                        character.second_ab.deafening_wave = true
                    }
                },
                cost: 1,
                desc: 'increases duration and radius of stuning'
            },
            {
                name: 'hate',
                type: "shield bash",
                canUse: (character: Character) => {
                     return character.second_ab instanceof ShieldBash &&
                    !character.second_ab.deafening_wave &&
                    !character.second_ab.hate
                },
                teach: (character: Character) => {
                    if(character.second_ab && character.second_ab instanceof ShieldBash){
                        character.second_ab.hate = true
                    }
                },
                cost: 1,
                desc: 'now your shield bash does not stun instead it has a chance to shatter enemy and to realise they bones that also can damage enemy'
            },
            {
                name: 'coordination',
                type: 'shield bash',
                canUse: (character: Character) => {
                     return character.second_ab instanceof ShieldBash &&
                    !character.second_ab.coordination
                },
                teach: (character: Character) => {
                    if(character.second_ab && character.second_ab instanceof ShieldBash){
                        character.second_ab.coordination = true
                    }
                },
                cost: 1,
                desc: 'now your shield bash has a chance to reduce attack speed by 50% and now it has reduced cost'
            },
            {
                name: 'increase grim pile effect',
                type: 'grim pile',
                canUse: (character: Character) => {
                     return character.second_ab instanceof GrimPile &&
                    !character.second_ab.increased_effect
                },
                teach: (character: Character) => {
                    if(character.second_ab && character.second_ab instanceof GrimPile){
                        character.second_ab.increased_effect = true
                    }
                },
                cost: 1,
                desc: 'increases armour rate and move speed which it gives'
            },
            {
                name: 'grim pile of will',
                type: 'grim pile',
                canUse: (character: Character) => {
                     return character.second_ab instanceof GrimPile &&
                    !character.second_ab.resistance
                },
                teach: (character: Character) => {
                    if(character.second_ab && character.second_ab instanceof GrimPile){
                        character.second_ab.resistance = true
                    }
                },
                cost: 1,
                desc: 'now it also increase status resist'
            },
            {
                name: 'reign of pain',
                type: "unleash pain",
                canUse: (character: Character) => {
                     return character.third_ab instanceof UnleashPain &&
                    !character.third_ab.reign_of_pain
                },
                teach: (character: Character) => {
                    if(character.third_ab && character.third_ab instanceof UnleashPain){
                        character.third_ab.reign_of_pain = true
                    }
                },
                cost: 1,
                desc: 'increases radius for searching enemies and count of ghost warriors for each resourse'
            },
            {
                name: 'restless warriors',
                type: "unleash pain",
                canUse: (character: Character) => {
                     return character.third_ab instanceof UnleashPain &&
                    !character.third_ab.restless_warriors
                },
                teach: (character: Character) => {
                    if(character.third_ab && character.third_ab instanceof UnleashPain){
                        character.third_ab.restless_warriors = true
                    }
                },
                cost: 1,
                desc: 'your ghost warriors from unleash pain ability deal 2 hits'
            },
            {
                name: 'ring of pain',
                type: 'pile of thorns',
                canUse: (character: Character) => {
                     return character.third_ab instanceof PileOfThornCast &&
                    !character.third_ab.ring_of_pain
                },
                teach: (character: Character) => {
                    if(character.third_ab && character.third_ab instanceof PileOfThornCast){
                        character.third_ab.ring_of_pain = true
                    }
                },
                cost: 1,
                desc: 'increases radius'
            },
            {
                name: 'collection of bones',
                type: 'pile of thorns',
                canUse: (character: Character) => {
                     return character.third_ab instanceof PileOfThornCast &&
                    !character.third_ab.collection_of_bones
                },
                teach: (character: Character) => {
                    if(character.third_ab && character.third_ab instanceof PileOfThornCast){
                        character.third_ab.collection_of_bones = true
                    }
                },
                cost: 1,
                desc: 'after duration realise bones for each killed enemy'
            },
            {
                name: 'pack with dead',
                type: 'self flagellation',
                canUse: (character: Character) => {
                     return character.utility instanceof SelfFlagellation &&
                    !character.utility.pack
                },
                teach: (character: Character) => {
                    if(character.utility && character.utility instanceof SelfFlagellation){
                        character.utility.pack = true
                    }
                },
                cost: 1,
                desc: 'you cannot die by ability'
            },
            {
                name: 'lesson of pain' ,
                type: 'self flagellation',
                canUse: (character: Character) => {
                     return character.utility instanceof SelfFlagellation &&
                    !character.utility.lesson
                },
                teach: (character: Character) => {
                    if(character.utility && character.utility instanceof SelfFlagellation){
                        character.utility.lesson = true
                    }
                },
                cost: 1,
                desc: 'increases move speed for short period after use'
            },
            {
                name: 'leaded by shost',
                type: 'ghost form',
                canUse: (character: Character) => {
                     return character.utility instanceof GhostForm &&
                    !character.utility.lead
                },
                teach: (character: Character) => {
                    if(character.utility && character.utility instanceof GhostForm){
                        character.utility.lead = true
                    }
                },
                cost: 1,
                desc: 'your teammates also give buff'
            },
            {
                name: 'afterlife cold',
                type: 'ghost form',
                canUse: (character: Character) => {
                     return character.utility instanceof GhostForm &&
                    !character.utility.afterlife_cold
                },
                teach: (character: Character) => {
                    if(character.utility && character.utility instanceof GhostForm){
                        character.utility.afterlife_cold = true
                    }
                },
                cost: 1,
                desc: 'freeze enemies on the way'
            },
            {
                name: 'service',
                canUse: (character: Character) => {
                    return !character.service
                },
                teach: (character: Character) => {
                    character.service = true
                },
                cost: 1,
                desc: 'you have a chance to get resourse when you regen life'
            },
            {
                name: 'conduct of pain',
                canUse: (character: Character) => {
                    return !character.conduct_of_pain
                },
                teach: (character: Character) => {
                    character.conduct_of_pain = true
                },
                cost: 1,
                desc: 'you have a chance to get resourse when you block hit'
            },
            {
                name: 'pain extract',
                canUse: (character: Character) => {
                    return !character.pain_extract
                },
                teach: (character: Character) => {
                    character.pain_extract = true
                },
                cost: 1,
                desc: 'you have a chance to get resourse when you kill enemies'
            },
            {
                name: 'burning circle',
                type: 'new ability',
                canUse: (character: Character) => {
                    return character instanceof Cultist && !(character.second_ab instanceof BurningCircle)
                },
                teach: (character: Character) => {
                    if(character instanceof Cultist){
                       character.second_ab = new BurningCircle(character)
                       character.updateClientSkill()
                    }  
                },
                cost: 1,
                desc: 'creates a circle of fire by damaging youself in which enemies take damage, the frequency of receiving damage depends on courage'
            },
            {
                name: 'all-consuming flame',
                type: 'burning circle',
                canUse: (character: Character) => {
                    return character instanceof Cultist && character.second_ab instanceof BurningCircle && !character.second_ab.consuming
                },
                teach: (character: Character) => {
                    if(character instanceof Cultist){
                       character.second_ab.consuming = true
                    }  
                },
                cost: 1,
                desc: 'increases radius'
            },
            {
                name: 'fire hatred',
                type: 'burning circle',
                canUse: (character: Character) => {
                    return character instanceof Cultist && character.second_ab instanceof BurningCircle && !character.second_ab.hatred
                },
                teach: (character: Character) => {
                    if(character instanceof Cultist){
                       character.second_ab.hatred = true
                    }  
                },
                cost: 1,
                desc: 'gives a chance to create explode when your kill enemy'
            },
             {
                name: 'devouring flame',
                type: 'burning circle',
                canUse: (character: Character) => {
                    return character instanceof Cultist && character.second_ab instanceof BurningCircle && !character.second_ab.devouring
                },
                teach: (character: Character) => {
                    if(character instanceof Cultist){
                       character.second_ab.devouring = true
                    }  
                },
                cost: 1,
                desc: 'gives a chance to increase duration when you kill enemy'
            },
        ]
    }

    generateUpgrades(){
        if(this.upgrades.length) return

        //get all upgrades for this class
        let p = super.getAllUpgrades()
        let all = this.getAllUpgrades().concat(p)
       
        //filter by usability
        let filtered = all.filter(elem => {
           return elem.cost <= this.grace && elem.canUse(this)
        })
        //get 3 random ones

        filtered.sort((a, b) =>  { return Math.random() > 0.5 ? 1 : -1 })

        filtered = filtered.slice(0, 3)
        
        //add to this.upgrades

        this.upgrades = this.upgrades.concat(filtered)
    }

    startGame(){
        let time = Date.now()
        this.item?.equip(this)
        this.next_life_regen_time = time + this.getRegenTimer()
        this.check_recent_hits_timer = time + 1000 
    }

    getSecondResourceTimer(){
        return 40000 + this.knowledge * 1000
    }

    regen(){
        let second_resouce_timer = this.getSecondResourceTimer()

        if(this.time >= this.check_recent_hits_timer){
            this.check_recent_hits_timer += 1000

            for(let i = this.recent_hits.length; i >= 0; i--){
                let hit_time = this.recent_hits[i]

                if(this.time - hit_time >= second_resouce_timer){
                    this.recent_hits.splice(i, 1);
                }
            }
        }

        if(this.time >= this.next_life_regen_time){
            this.next_life_regen_time += this.getRegenTimer()
            
            this.addLife()

            if(this.service){
                if(Func.chance(this.getSecondResource() * 10)){
                    this.addResourse()
                }
            }
        }
    }

     succesefulKill(){
        this.onKillTriggers.forEach(elem => {
            elem.trigger(this)
        })

        if(this.pain_extract && Func.chance(5)){
            this.addResourse()
        }
    }

    addLife(count = 1, ignore_poison = false, ignore_limit = false){
        if(!this.can_regen_life && !ignore_poison) return

        for(let i = 0; i < count; i++){
            let previous = this.life_status

            if(previous >= 3 && !ignore_limit){
                if(previous >= 3 && !ignore_limit){
                    if(this.lust_for_life && Func.chance(this.getSecondResource() * 5)){
                
                    }
                    else{
                        return
                    } 
                }
            }
            
            this.life_status ++

            if(previous === 1){
                this.addMoveSpeedPenalty(10)
            }
            if(previous === 2){
                this.addMoveSpeedPenalty(5)
            }
        }
    }

    setDamagedAct(){
        this.damaged = true
        this.state = 'damaged'
        this.can_move_by_player = false
        this.stateAct = this.damagedAct

        this.cancelAct = () => {
            this.can_move_by_player = true
            this.damaged = false
        }

        this.setTimerToGetState(300)
    }

    useUtility(){
        this.utility?.use()
    }

    toJSON(){
        return Object.assign(super.toJSON(),
            {
                resource: this.getSecondResource(),
                max_resource: this.max_resource,
                life_status: this.life_status,
                first: this.first_ab?.canUse(),
                secondary: this.second_ab?.canUse(),
                finisher: this.third_ab?.canUse(),
                utility: this.utility?.canUse(),
                second: this.getSecondResource()
            }
        )
    }

    getAttackSpeed() {
        let value = this.attack_speed - (this.might * 100)
        
        if(value < Cultist.MIN_ATTACK_SPEED){
            value = Cultist.MIN_ATTACK_SPEED
        }

        return value
    }

    useSecond(){
        if(!this.can_use_skills) return

        if(this.third_ab?.canUse()){
            this.third_ab?.use()
            this.third_ab.afterUse()
        
        }
        else if(this.second_ab?.canUse()){
            this.useNotUtilityTriggers.forEach(elem => {
                elem.trigger(this)
            })

            this.second_ab.use()
            this.last_skill_used_time = this.time
              
        }

        
    }

    succesefulHit(){
        this.onHitTriggers.forEach(elem => {
            elem.trigger(this)
        })
    }

    getCastSpeed(){
        let value = this.cast_speed - (this.speed * 100)

        if(value < Cultist.MIN_CAST_SPEED){
            value = Cultist.MIN_CAST_SPEED
        }

        return value
    }

    payCost(){
        if(!Func.chance(this.knowledge * 3)){
            this.recent_hits = this.recent_hits.filter((elem, index) => index >= this.pay_to_cost) 
        }
       
        this.pay_to_cost = 0 
    }

    isStatusResist(){
        return Func.chance(this.status_resistance + (this.will * 3))
    }
}