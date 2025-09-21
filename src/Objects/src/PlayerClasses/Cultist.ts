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
import WanderingEvil from "../../../Abilities/Cultist/WanderingEvil";
import Func from "../../../Func";
import Level from "../../../Level";
import Immortality from "../../../Status/Immortality";
import CallWarriorWhenBlock from "../../../Triggers/CallWarriorWhenBlock";
import Armour from "../../Effects/Armour";
import Blood from "../../Effects/Blood";
import ToothExplode from "../../Effects/ToothExplode";
import Character from "../Character";
import Unit from "../Unit";
import Flyer from "./Flyer";

export default class Cultist extends Character{
    
    static MIN_ATTACK_SPEED = 200
    static MIN_CAST_SPEED = 150
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
        this.attack_point_radius = 4.3
        this.attack_radius = 7
        this.attack_speed = 1700
        this.might = 100
        this.cast_speed = 1700
        this.name = 'cultist'
        this.move_speed = 0.43
        this.avoid_damaged_state_chance = 15
        this.armour_rate = 25
        this.resource = 0
        this.max_resource = 7
        this.hit_x = undefined
        this.hit_y = undefined

        this.life_status = 3
        this.base_regen_time = 8500
        this.service = false
        this.conduct_of_pain = false
        this.pain_extract = false

        this.recent_hits = []
        this.block_chance = 65
    }

    getSkipDamageStateChance(){
        return this.avoid_damaged_state_chance + this.agility * 3
    }

    getMoveSpeed(): number{
        let total_inc = this.move_speed_penalty + this.agility
    
        if(total_inc === 0) return this.move_speed

        if(total_inc > 200) total_inc = 200
        if(total_inc < -95) total_inc = -95
       
        return this.move_speed * (1 + total_inc / 100)
    }

    createAbilities(abilities: any){
        
        let main_name = abilities.find(elem => elem.type === 1 && elem.selected).name

        if(main_name === 'slam'){
            this.first_ability = new Slam(this)
        }
        else if(main_name === 'rune'){
            this.first_ability = new Rune(this)
        }
    
        let secondary_name = abilities.find(elem => elem.type === 2 && elem.selected).name
        
        if(secondary_name === 'shield bash'){
            this.second_ability = new ShieldBash(this)
        }
        else if(secondary_name === 'grim pile'){
            this.second_ability = new GrimPile(this)
        }

        let finisher_name = abilities.find(elem => elem.type === 3 && elem.selected).name

        if(finisher_name === 'unleash pain'){
            this.third_ability = new UnleashPain(this)
        }
        else if(finisher_name === 'pile of thorns'){
            this.third_ability = new PileOfThornCast(this)
        }
        else if(finisher_name === 'wandering evil'){
            this.third_ability = new WanderingEvil(this)
        }
    
        let utility_name = abilities.find(elem => elem.type === 4 && elem.selected).name

        if(utility_name === 'self flagellation'){
            this.utility = new SelfFlagellation(this)
        }
        else if(utility_name === 'ghost form'){
            this.utility = new GhostForm(this)
        }
    }

    addCourage(count = 1){
        if(!this.can_get_courage) return

        for(let i = 0; i < count;i ++){
            this.recent_hits.push(this.time)
        }

        if(this.can_be_enlighten && this.recent_hits.length >= 8){
            this.can_be_enlighten = false

            this.enlight()

            setTimeout(() => {
                this.can_be_enlighten = true
            }, this.getEnlightenTimer())
        }
    }

    addResourse(count: number = 1, ignore_limit = false){
        if(!this.can_regen_resource) return

        super.addResourse()
        
        if(this.resource < this.max_resource || ignore_limit){
            this.resource += count
        }

        if(Func.chance(this.durability * 3, this.is_lucky)){
            if(this.resource < this.max_resource){
                this.resource ++
            }
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

        let s = new Immortality(this.level.time)
        s.setDuration(3000)
        this.level.setStatus(this, s)
       
        this.level.addSound('enlight', this.x, this.y)
    }

    getTotalArmour(){
        return this.armour_rate + this.might
    }

    getPenaltyByLifeStatus(): number{
        if(this.life_status === 2){
            return 5
        }
        else if(this.life_status === 1){
            return 10
        }
        else{
            return 0
        }
    }

    isBlock(): boolean {
        let b_chance = this.block_chance + this.durability

        if(b_chance > 90){
            b_chance = 90
        }

        return this.state === 'defend' && Func.chance(b_chance, this.is_lucky)
    }

    isArmourHit(unit: Unit): boolean{
        let p = 0

        if(unit){
            p = unit.pierce
        }

        let total = this.getTotalArmour()

        if(p >= total) return false

        let arm = total - p

        if(arm > Cultist.MAX_ARMOUR){
            arm = Cultist.MAX_ARMOUR
        }

        return !this.no_armour && Func.chance(arm, this.is_lucky)
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

        if(this.ward){
            this.loseWard()
            let e = new ToothExplode(this.level)
            e.setPoint(Func.random(this.x - 2, this.x + 2), this.y)
            e.z = Func.random(2, 8)
            this.level.effects.push(e)

            this.level.addSound({
                name: 'ward hit',
                x: this.x,
                y: this.y
            })

            return
        }

        this.playerWasHited(unit)
        
        if(this.isBlock()){
            this.level.sounds.push({
                name: 'metal hit',
                x: this.x,
                y: this.y
            })

            if(this.conduct_of_pain && Func.chance(50, this.is_lucky)){
                this.addResourse()
            }

            this.succesefulBlock(unit)

            return
        } 

        this.addResourse()
        this.addCourage()

        if(this.isArmourHit(unit)){
            this.level.sounds.push({
                name: 'metal hit',
                x: this.x,
                y: this.y
            })
            let e = new Armour(this.level)
            e.setPoint(Func.random(this.x - 2, this.x + 2), this.y)
            e.z = Func.random(2, 8)
            this.level.effects.push(e)
            this.succesefulArmourBlock(unit)
            return
        }

        if(Func.chance(30)){
            this.level.addSound('get hit', this.x, this.y)
        }
        
        let e = new Blood(this.level)
        e.setPoint(Func.random(this.x - 2, this.x + 2), this.y)
        e.z = Func.random(2, 8)
        this.level.effects.push(e)

        let will_avoid = this.will * 2

        if(will_avoid > 50){
            will_avoid = 50
        }

        if(Func.chance(will_avoid, this.is_lucky)){
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
                    return character.first_ability instanceof Rune && !character.first_ability.runefield
                },
                teach: (character: Character) => {
                    if(character.first_ability && character.first_ability instanceof Rune){
                        character.first_ability.runefield = true
                        character.first_ability.cost += 1
                    }
                },
                cost: 5,
                desc: 'you will create additional rune for each resourse but now it also increased cost by 1'
            },
            {
                name: 'explosive runes',
                type: 'rune',
                canUse: (character: Character) => {
                    return character.first_ability instanceof Rune && !character.first_ability.explosive
                },
                teach: (character: Character) => {
                    if(character.first_ability && character.first_ability instanceof Rune){
                        character.first_ability.explosive = true
                    }
                },
                cost: 2,
                desc: 'increases radius of explosion'
            },
            {
                name: 'fast detonation',
                type: 'rune',
                canUse: (character: Character) => {
                    return character.first_ability instanceof Rune && !character.first_ability.fast_detonation
                },
                teach: (character: Character) => {
                    if(character.first_ability && character.first_ability instanceof Rune){
                        character.first_ability.fast_detonation = true
                    }
                },
                cost: 3,
                desc: 'increases detonation rate'
            },
            {
                name: 'second detanation',
                type: 'rune',
                canUse: (character: Character) => {
                    return character.first_ability instanceof Rune && !character.first_ability.second_detanation
                },
                teach: (character: Character) => {
                    if(character.first_ability && character.first_ability instanceof Rune){
                        character.first_ability.second_detanation = true
                        character.first_ability.cost ++
                    }
                },
                cost: 1,
                desc: 'your runes have a chance to explode additional time but now it also increased cost by 1'
            },
            {
                name: 'soul shatter',
                type: 'new ability',
                canUse: (character: Character) => {
                    return !(character.first_ability instanceof SoulShatter)
                },
                teach: (character: Character) => {
                    character.first_ability = new SoulShatter(this)
                    character.updateClientSkill()
                },
                cost: 4,
                desc: 'hit the single enemy if they died, create a soul projectiles count them based of your resourses'
            },
            {
                name: 'slaming',
                type: 'slam',
                canUse: (character: Character) => {
                    return character.first_ability instanceof Slam && !character.first_ability.slaming
                },
                teach: (character: Character) => {
                    if(character.first_ability && character.first_ability instanceof Slam){
                        character.first_ability.slaming = true
                    }
                },
                cost: 1,
                desc: 'increases the radius of slam hit'
            },
            {
                name: 'soul extraction',
                type: 'slam',
                canUse: (character: Character) => {
                    return character.first_ability instanceof Slam && !character.first_ability.soul_extraction
                },
                teach: (character: Character) => {
                    if(character.first_ability && character.first_ability instanceof Slam){
                        character.first_ability.soul_extraction = true
                    }
                },
                cost: 2,
                desc: 'increases the chance to get grace from killing enemies'
            },
            {
                name: 'deafening wave',
                type: "shield bash",
                canUse: (character: Character) => {
                    return character.second_ability instanceof ShieldBash &&
                    !character.second_ability.deafening_wave &&
                    !character.second_ability.hate

                },
                teach: (character: Character) => {
                    if(character.second_ability && character.second_ability instanceof ShieldBash){
                        character.second_ability.deafening_wave = true
                    }
                },
                cost: 2,
                desc: 'increases duration and radius of stuning'
            },
            {
                name: 'hate',
                type: "shield bash",
                canUse: (character: Character) => {
                     return character.second_ability instanceof ShieldBash &&
                    !character.second_ability.deafening_wave &&
                    !character.second_ability.hate
                },
                teach: (character: Character) => {
                    if(character.second_ability && character.second_ability instanceof ShieldBash){
                        character.second_ability.hate = true
                    }
                },
                cost: 2,
                desc: 'now your shield bash does not stun instead it has a chance to shatter enemy and to realise they bones that also can damage enemy'
            },
            {
                name: 'coordination',
                type: 'shield bash',
                canUse: (character: Character) => {
                     return character.second_ability instanceof ShieldBash &&
                    !character.second_ability.coordination
                },
                teach: (character: Character) => {
                    if(character.second_ability && character.second_ability instanceof ShieldBash){
                        character.second_ability.coordination = true
                    }
                },
                cost: 3,
                desc: 'now your shield bash has a chance to reduce attack speed by 50% and now it has chance not to be used after using'
            },
            {
                name: 'increase grim pile effect',
                type: 'grim pile',
                canUse: (character: Character) => {
                     return character.second_ability instanceof GrimPile &&
                    !character.second_ability.increased_effect
                },
                teach: (character: Character) => {
                    if(character.second_ability && character.second_ability instanceof GrimPile){
                        character.second_ability.increased_effect = true
                    }
                },
                cost: 1,
                desc: 'increases armour rate and move speed which it gives'
            },
            {
                name: 'grim pile of will',
                type: 'grim pile',
                canUse: (character: Character) => {
                     return character.second_ability instanceof GrimPile &&
                    !character.second_ability.resistance
                },
                teach: (character: Character) => {
                    if(character.second_ability && character.second_ability instanceof GrimPile){
                        character.second_ability.resistance = true
                    }
                },
                cost: 1,
                desc: 'now it also increase status resist'
            },
            {
                name: 'reign of pain',
                type: "unleash pain",
                canUse: (character: Character) => {
                     return character.third_ability instanceof UnleashPain &&
                    !character.third_ability.reign_of_pain
                },
                teach: (character: Character) => {
                    if(character.third_ability && character.third_ability instanceof UnleashPain){
                        character.third_ability.reign_of_pain = true
                    }
                },
                cost: 1,
                desc: 'increases radius for searching enemies and count of ghost warriors for each resourse'
            },
            {
                name: 'restless warriors',
                type: "unleash pain",
                canUse: (character: Character) => {
                     return character.third_ability instanceof UnleashPain &&
                    !character.third_ability.restless_warriors
                },
                teach: (character: Character) => {
                    if(character.third_ability && character.third_ability instanceof UnleashPain){
                        character.third_ability.restless_warriors = true
                    }
                },
                cost: 3,
                desc: 'your ghost warriors from unleash pain ability deal 2 hits'
            },
            {
                name: 'ring of pain',
                type: 'pile of thorns',
                canUse: (character: Character) => {
                     return character.third_ability instanceof PileOfThornCast &&
                    !character.third_ability.ring_of_pain
                },
                teach: (character: Character) => {
                    if(character.third_ability && character.third_ability instanceof PileOfThornCast){
                        character.third_ability.ring_of_pain = true
                    }
                },
                cost: 3,
                desc: 'increases radius and frequency'
            },
            {
                name: 'collection of bones',
                type: 'pile of thorns',
                canUse: (character: Character) => {
                     return character.third_ability instanceof PileOfThornCast &&
                    !character.third_ability.collection_of_bones
                },
                teach: (character: Character) => {
                    if(character.third_ability && character.third_ability instanceof PileOfThornCast){
                        character.third_ability.collection_of_bones = true
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
                cost: 2,
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
                cost: 2,
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
                cost: 3,
                desc: 'you have a chance to get resourse when you kill enemies'
            },
            {
                name: 'burning circle',
                type: 'new ability',
                canUse: (character: Character) => {
                    return character instanceof Cultist && !(character.second_ability instanceof BurningCircle)
                },
                teach: (character: Character) => {
                    if(character instanceof Cultist){
                       character.second_ability = new BurningCircle(character)
                       character.updateClientSkill()
                    }  
                },
                cost: 5,
                desc: 'creates a circle of fire by damaging youself in which enemies take damage, the frequency of receiving damage depends on courage'
            },
            {
                name: 'all-consuming flame',
                type: 'burning circle',
                canUse: (character: Character) => {
                    return character instanceof Cultist && character.second_ability instanceof BurningCircle && !character.second_ability.consuming
                },
                teach: (character: Character) => {
                    if(character instanceof Cultist){
                       character.second_ability.consuming = true
                    }  
                },
                cost: 2,
                desc: 'increases radius'
            },
            {
                name: 'fire hatred',
                type: 'burning circle',
                canUse: (character: Character) => {
                    return character instanceof Cultist && character.second_ability instanceof BurningCircle && !character.second_ability.hatred
                },
                teach: (character: Character) => {
                    if(character instanceof Cultist){
                       character.second_ability.hatred = true
                    }  
                },
                cost: 1,
                desc: 'gives a chance to create explode when your kill enemy'
            },
            {
                name: 'devouring flame',
                type: 'burning circle',
                canUse: (character: Character) => {
                    return character instanceof Cultist && character.second_ability instanceof BurningCircle && !character.second_ability.devouring
                },
                teach: (character: Character) => {
                    if(character instanceof Cultist){
                       character.second_ability.devouring = true
                    }  
                },
                cost: 1,
                desc: 'gives a chance to increase duration when you kill enemy'
            },
            {
                name: 'spiritual call',
                canUse: (character: Character) => {
                    return !character.when_block_triggers.some(elem => elem instanceof CallWarriorWhenBlock)
                },
                teach: (character: Character) => {
                    if(character instanceof Cultist){
                       character.when_block_triggers.push(new CallWarriorWhenBlock())
                    }  
                },
                cost: 1,
                desc: 'when you block you can summon spirit warrior'
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
        this.equipItems()
        this.next_life_regen_time = time + this.getRegenTimer()
        this.check_recent_hits_timer = time + 1000 
    }

    getSecondResourceTimer(){
        return 10000 + this.knowledge * 1000
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

            this.sayPhrase()
        }

        if(this.time >= this.next_life_regen_time){
            this.next_life_regen_time += this.getRegenTimer()
            
            this.addLife()

            if(this.service){
                if(Func.chance(this.getSecondResource() * 10, this.is_lucky)){
                    this.addResourse()
                }
            }
        }
    }

    succesefulKill(enemy){
        this.on_kill_triggers.forEach(elem => {
            elem.trigger(this, enemy)
        })

        if(this.pain_extract && Func.chance(5, this.is_lucky)){
            this.addResourse()
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

    getAttackSpeed() {
        let value = this.attack_speed - (this.might * 50)
        
        if(value < Cultist.MIN_ATTACK_SPEED){
            value = Cultist.MIN_ATTACK_SPEED
        }

        return value
    }

    getCastSpeed(){
        let value = this.cast_speed - (this.speed * 50)

        if(value < Cultist.MIN_CAST_SPEED){
            value = Cultist.MIN_CAST_SPEED
        }

        return value
    }

    payCost(){
        if(Func.notChance(this.knowledge * 4, this.is_lucky)){
            this.resource -= this.pay_to_cost
        }
        
        this.pay_to_cost = 0 
    }

    isStatusResist(){
        return Func.chance(this.status_resistance + (this.will * 3), this.is_lucky)
    }
}