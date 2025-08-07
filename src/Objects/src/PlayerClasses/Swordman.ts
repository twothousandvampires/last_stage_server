import Charge from "../../../Abilities/Swordman/Charge";
import Commands from "../../../Abilities/Swordman/Commands";
import CursedWeapon from "../../../Abilities/Swordman/CursedWeapon";
import Jump from "../../../Abilities/Swordman/Jump";
import Quake from "../../../Abilities/Swordman/Quake";
import ShatteredWeapon from "../../../Abilities/Swordman/ShatteredWeapon";
import WeaponSwing from "../../../Abilities/Swordman/WeaponSwing";
import WeaponThrow from "../../../Abilities/Swordman/WeaponThrow";
import Whirlwind from "../../../Abilities/Swordman/Whirlwind";
import Func from "../../../Func";
import Level from "../../../Level";
import Armour from "../../Effects/Armour";
import Blood from "../../Effects/Blood";
import Character from "../Character";

export default class Swordman extends Character{
    
    weapon_angle: number
    chance_to_get_additional_point: number
    chance_to_hit_additional_target: number
    resource: number
    max_resource: number
    next_life_regen_time: any
    recent_kills: any[]
    check_recent_hits_timer: any

    constructor(level: Level){
        super(level)

        this.weapon_angle = 0.8
        this.attack_radius = 7
        this.attack_speed = 1500
        this.name = 'swordman'
        this.move_speed = 0.5
        this.avoid_damaged_state_chance = 10
        this.chance_to_get_additional_point = 0
        this.chance_to_hit_additional_target = 0
        this.armour_rate = 15
        this.resource = 0
        this.max_resource = 7

        this.life_status = 3
        this.base_regen_time = 10000
        this.recent_kills = []
    }

    getTargetsCount(){
        return this.might + 1
    }

    succesefulKill(){
        this.onKillTriggers.forEach(elem => {
            elem.trigger(this)
        })
        if(Func.chance(this.knowledge * 3)){
            this.recent_kills.push(this.time)
        }
        this.recent_kills.push(this.time)
    }

    getAttackMoveSpeedPenalty(){
        return 70 - (this.agility * 3)
    }

    createAbilities(abilities: any){
        
        let main_name = abilities.find(elem => elem.type === 1 && elem.selected).name

        if(main_name === 'swing'){
            this.first_ab = new WeaponSwing(this)
        }
        else if(main_name === 'weapon throw'){
            this.first_ab = new WeaponThrow(this)
        }

        let secondary_name = abilities.find(elem => elem.type === 2 && elem.selected).name

        if(secondary_name === 'jump'){
            this.second_ab = new Jump(this)
        }
        else if(secondary_name === 'charge'){
            this.second_ab = new Charge(this)
        }

        let finisher_name = abilities.find(elem => elem.type === 3 && elem.selected).name

        if(finisher_name === 'whirlwind'){
            this.third_ab = new Whirlwind(this)
        }
        else if(finisher_name === 'quake'){
            this.third_ab = new Quake(this)
        }

        let utility_name = abilities.find(elem => elem.type === 4 && elem.selected).name

        if(utility_name === 'cursed weapon'){
            this.utility = new CursedWeapon(this)
        }
        else if(utility_name === 'commands'){
            this.utility = new Commands(this)
        }
    }

    takeDamage(unit:any = undefined, options: any = {}){
        if(!this.can_be_damaged) return
        
        if(options?.instant_death){
            unit?.succesefulKill()
            this.is_dead = true
            this.life_status = 0
            this.setState(this.setDyingState)
            this.level.playerDead()
            return
        }
        if(this.damaged || this.is_dead) return

        this.playerWasHited()

        let b_chance = 50 + this.agility * 3

        if(b_chance > 90){
            b_chance = 90
        }

        if(this.state === 'defend' && Func.chance(b_chance)){
            this.level.sounds.push({
                name: 'metal hit',
                x: this.x,
                y: this.y
            })
            return
        } 

        let arm = this.armour_rate > 95 ? 95 : this.armour_rate

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

        if(!Func.chance(this.might * 6)){
            this.recent_kills = this.recent_kills.filter((elem, index) => index >= 4)
        }
       
        this.subLife(unit, options)
    }

    getSkipDamageStateChance(){
        return this.avoid_damaged_state_chance + this.will * 5
    }

    getRegenTimer(){
        return this.base_regen_time - this.will * 150
    }

    getAllUpgrades(){
        return [
            {
                name: 'echo swing',
                canUse: (character: Character) => {
                    return character.first_ab instanceof WeaponSwing && !character.first_ab.echo_swing
                },
                teach: (character: Character) => {
                    if(character.first_ab && character.first_ab instanceof WeaponSwing){
                        character.first_ab.echo_swing = true
                    }
                },
                cost: 1,
                desc: 'gives your weapon swing chance to land an additional swing after a short time'
            },
            {
                name: 'improved swing technology',
                canUse: (character: Character) => {
                    return character.first_ab instanceof WeaponSwing && !character.first_ab.improved_swing_technology
                },
                teach: (character: Character) => {
                    if(character.first_ab && character.first_ab instanceof WeaponSwing){
                        character.first_ab.improved_swing_technology = true
                    }
                },
                cost: 2,
                desc: 'gives your weapon swing chance to increase move and attack speed for a short period'
            },
            {
                name: 'light grip',
                canUse: (character: Character) => {
                    return character.first_ab instanceof WeaponThrow && !character.first_ab.light_grip
                },
                teach: (character: Character) => {
                    if(character.first_ab && character.first_ab instanceof WeaponThrow){
                        character.first_ab.light_grip = true
                    }
                },
                cost: 3,
                desc: 'gives your weapon throw ability a chance to reduce cd time between uses by 50%'
            },
            {
                name: 'returning',
                canUse: (character: Character) => {
                    return character.first_ab instanceof WeaponThrow && !character.first_ab.returning && !character.first_ab.shattering
                },
                teach: (character: Character) => {
                    if(character.first_ab && character.first_ab instanceof WeaponThrow){
                        character.first_ab.returning = true
                    }
                },
                cost: 3,
                desc: 'gives your weapon throw ability a chance to return, will icreases that chance'
            },
            {
                name: 'shattering',
                canUse: (character: Character) => {
                    return character.first_ab instanceof WeaponThrow && !character.first_ab.returning && !character.first_ab.shattering
                },
                teach: (character: Character) => {
                    if(character.first_ab && character.first_ab instanceof WeaponThrow){
                        character.first_ab.shattering = true
                    }
                },
                cost: 3,
                desc: 'gives your weapon throw ability a chance to shatter up to 3 shards'
            },
            {
                name: 'heavy landing',
                canUse: (character: Character) => {
                    return character.second_ab instanceof Jump && !character.second_ab.heavy_landing
                },
                teach: (character: Character) => {
                    if(character.second_ab && character.second_ab instanceof Jump){
                        character.second_ab.heavy_landing = true
                    }
                },
                cost: 2,
                desc: 'after landing your get armour by each hited enemy'
            },
             {
                name: 'stomp',
                canUse: (character: Character) => {
                    return character.second_ab instanceof Jump && !character.second_ab.stomp
                },
                teach: (character: Character) => {
                    if(character.second_ab && character.second_ab instanceof Jump){
                        character.second_ab.stomp = true
                    }
                },
                cost: 5,
                desc: 'increases the radius in which enemies will take damage'
            },
            {
                name: 'destroyer',
                canUse: (character: Character) => {
                    return character.second_ab instanceof Charge && !character.second_ab.destroyer
                },
                teach: (character: Character) => {
                    if(character.second_ab && character.second_ab instanceof Charge){
                        character.second_ab.destroyer = true
                    }
                },
                cost: 3,
                desc: 'gives a chance based by your might to deal damage to your charge ability'
            },
            {
                name: 'vision of possibilities',
                canUse: (character: Character) => {
                    return character.second_ab instanceof Charge && !character.second_ab.possibilities
                },
                teach: (character: Character) => {
                    if(character.second_ab && character.second_ab instanceof Charge){
                        character.second_ab.possibilities = true
                    }
                },
                cost: 1,
                desc: 'if you hit 3 or more enemies you have a chance to get resourse(chance increases by agility)'
            },
            {
                name: 'blood harvest',
                canUse: (character: Character) => {
                    return character.third_ab instanceof Whirlwind && !character.third_ab.blood_harvest
                },
                teach: (character: Character) => {
                    if(character.third_ab && character.third_ab instanceof Whirlwind){
                        character.third_ab.blood_harvest = true
                    }
                },
                cost: 3,
                desc: 'after use whirlwind you have a chance to create blood sphere based of count of killed enemies'
            },
            {
                name: 'fan of swords',
                canUse: (character: Character) => {
                    return character.third_ab instanceof Whirlwind && !character.third_ab.fan_of_swords
                },
                teach: (character: Character) => {
                    if(character.third_ab && character.third_ab instanceof Whirlwind){
                        character.third_ab.fan_of_swords = true
                    }
                },
                cost: 10,
                desc: 'your whirlwind now fires fan of swords equals your strength inproves of weapon throw ability also works'
            },
            {
                name: 'consequences',
                canUse: (character: Character) => {
                    return character.third_ab instanceof Quake && !character.third_ab.consequences
                },
                teach: (character: Character) => {
                    if(character.third_ab && character.third_ab instanceof Quake){
                        character.third_ab.consequences = true
                    }
                },
                cost: 3,
                desc: 'quake have a biger radius but also have incresed weakness duration'
            },
            {
                name: 'selfcare',
                canUse: (character: Character) => {
                    return character.third_ab instanceof Quake && !character.third_ab.selfcare
                },
                teach: (character: Character) => {
                    if(character.third_ab && character.third_ab instanceof Quake){
                        character.third_ab.selfcare = true
                    }
                },
                cost: 1,
                desc: 'your quake ability dont deal damage to you'
            },
        
            {
                name: 'drinker',
                canUse: (character: Character) => {
                    return character.utility instanceof CursedWeapon && !character.utility.drinker
                },
                teach: (character: Character) => {
                    if(character.utility && character.utility instanceof CursedWeapon){
                        character.utility.drinker = true
                    }
                },
                cost: 1,
                desc: 'while you affect by cursed weapon after kill you have a chance to restore life'
            },
            {
                name: 'fast commands',
                canUse: (character: Character) => {
                    return character.utility instanceof Commands && !character.utility.fast_commands
                },
                teach: (character: Character) => {
                    if(character.utility && character.utility instanceof Commands){
                        character.utility.fast_commands = true
                    }
                },
                cost: 1,
                desc: 'buff is shorter but stronger'
            },
            {
                name: 'shattered weapon',
                canUse: (character: Character) => {
                    return !(character.second_ab instanceof ShatteredWeapon)
                },
                teach: (character: Character) => {
                    if(character instanceof Swordman){
                        character.second_ab = new ShatteredWeapon(character)
                        character.updateClientSkill()
                    }
                },
                cost: 1,
                desc: 'fires a magic fragments of your weapon when it hits walls or enemies when it returns and gives armour'
            },
            {
                name: 'searching weapon',
                canUse: (character: Character) => {
                    return character.attack_radius < 10
                },
                teach: (character: Character) => {
                    if(character instanceof Swordman){
                        character.attack_radius ++
                    }
                },
                cost: 1,
                desc: 'increases weapon attack range'
            },
            {
                name: 'attack speed',
                canUse: (character: Character) => {
                    return character.attack_speed > 1000
                },
                teach: (character: Character) => {
                    if(character instanceof Swordman){
                        character.attack_speed -= 100
                    }
                },
                cost: 1,
                desc: 'increases weapon attack speed'
            },
            {
                name: 'discipline',
                canUse: (character: Character) => {
                    return character.max_resource < 12
                },
                teach: (character: Character) => {
                    if(character instanceof Swordman){
                        character.max_resource ++
                    }
                },
                cost: 1,
                desc: 'increases maximum of resources'
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
        return 8000
    }

    regen(){
        let second_resouce_timer = this.getSecondResourceTimer()

        if(this.time >= this.check_recent_hits_timer){
            this.check_recent_hits_timer += 1000

            for(let i = this.recent_kills.length; i >= 0; i--){
                let hit_time = this.recent_kills[i]

                if(this.time - hit_time >= second_resouce_timer){
                    this.recent_kills.splice(i, 1);
                }
            }
        }

        if(this.time >= this.next_life_regen_time){
            this.next_life_regen_time += this.getRegenTimer()
            
            this.addLife()
        }
    }

    addLife(count = 1, ignore_poison = false){
        if(!this.can_regen_life && !ignore_poison) return

        for(let i = 0; i < count; i++){
            let previous = this.life_status

            if(previous > 3){
                return
            }

            if(previous === 3){
                if(Func.random() >= this.durability * 10){
                    return
                }
            }

            this.life_status ++

            if(previous === 1){
                this.addMoveSpeedPenalty(30)
            }
            if(previous === 2){
                this.addMoveSpeedPenalty(10)
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

        this.setTimerToGetState(300 - this.durability * 20)
    }

    useUtility(){
        this.utility?.use()
    }

    toJSON(){
        return Object.assign(super.toJSON(),
            {
                resource: this.resource,
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

    getSecondResource(){
        return this.recent_kills.length
    }

    getAttackSpeed() {
        return this.attack_speed - (this.speed * 50)
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

    addResourse(count: number = 1){
        this.addPoint(count)
    }

    addPoint(count: number = 1){
       if(!this.can_regen_resource) return
       
       if(this.resource > this.max_resource){
          return
       }
       
       if(Func.chance(this.knowledge * 6)){
          count++
       }

       this.resource += count
    }

    succesefulHit(){
        this.onHitTriggers.forEach(elem => {
            elem.trigger(this)
        })
    }

    setDefend(){
        this.state = 'defend'
        this.stateAct = this.defendAct
        let reduce = 80 - this.speed * 5
        this.addMoveSpeedPenalty(-reduce)

        this.cancelAct = () => {
            this.addMoveSpeedPenalty(reduce)
        }
    }
}