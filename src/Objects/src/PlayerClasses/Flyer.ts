import AnnihilatorBeam from "../../../Abilities/Flyer/AnnihilatorBeam";
import Fireball from "../../../Abilities/Flyer/Fireball";
import FlameWall from "../../../Abilities/Flyer/FlameWall";
import ForkedLightning from "../../../Abilities/Flyer/ForkedLightning";
import Frostnova from "../../../Abilities/Flyer/Frostnova";
import FrostSphere from "../../../Abilities/Flyer/FrostSphere";
import LightBeacon from "../../../Abilities/Flyer/LightBeacon";
import LightningBolt from "../../../Abilities/Flyer/LightningBolt";
import StaticField from "../../../Abilities/Flyer/StaticField";
import Teeth from "../../../Abilities/Flyer/Teeth";
import Teleportation from "../../../Abilities/Flyer/Teleportation";
import Func from "../../../Func";
import Level from "../../../Level";
import Armour from "../../Effects/Armour";
import Blood from "../../Effects/Blood";
import ToothExplode from "../../Effects/ToothExplode";
import { Lightning } from "../../Projectiles/Lightning";
import Character from "../Character";

export default class Flyer extends Character{

    next_life_regen_time: any
    next_mana_regen_time: any
    takeoff: boolean
    allow_mana_regen_while_def: boolean
    charged_shield: boolean
    recent_cast: any[]
    check_recent_hits_timer: any
    mental_shield: boolean

    constructor(level: Level){
        super(level)

        this.cast_speed = 1500
        this.name = 'flyer'
        this.move_speed = 0.4
        this.avoid_damaged_state_chance = 0
        this.armour_rate = 0
        this.resource = 0
        this.max_resource = 7
        this.life_status = 3
        this.base_regen_time = 15000
        this.takeoff = false
        this.allow_mana_regen_while_def = false
        this.charged_shield = false
        this.mental_shield = false
        this.recent_cast = []
    }

    getAdditionalRadius(){
        return Math.floor(this.might / 2)
    }

    getAllUpgrades(){
        return [
                {
                    name: 'scorching',
                    type: '(flame wall)',
                    canUse: (character: Character) => {
                        return character.second_ab instanceof FlameWall && !character.second_ab.scorching
                    },
                    teach: (character: Character) => {
                        if(character && character.second_ab instanceof FlameWall){
                            character.second_ab.scorching = true
                        }
                    },
                    cost: 1,
                    desc: 'your flamewall burn faster'
                },
                {
                    name: 'frendly flame',
                    type: '(flame wall)',
                    canUse: (character: Character) => {
                        return character.second_ab instanceof FlameWall && !character.second_ab.frendly_flame
                    },
                    teach: (character: Character) => {
                        character.second_ab.frendly_flame = true
                    },
                    cost: 1,
                    desc: 'your flamewall does not damage to players'
                },
                {
                    name: 'takeoff',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && !character.takeoff
                    },
                    teach: (character: Character) => {
                        character.takeoff = true
                    },
                    cost: 1,
                    desc: 'gives your phasing while you are defended'
                },
                 {
                    name: 'teeth',
                    type: 'new ability',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && !(character.first_ab instanceof Teeth)
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer){
                            character.first_ab = new Teeth(character)
                            character.updateClientSkill()
                        }
                    },
                    cost: 1,
                    desc: 'fires a sereral of teeth'
                },
                {
                    name: 'body melting',
                    type: 'fireball',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.first_ab instanceof Fireball) && !character.first_ab.body_melting
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.first_ab instanceof Fireball){
                            character.first_ab.body_melting = true
                        }
                    },
                    cost: 1,
                    desc: 'gives your fireball a chance to pierce the enemy'
                },
                {
                    name: 'ignite',
                    type: 'fireball',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.first_ab instanceof Fireball) && !character.first_ab.ignite
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.first_ab instanceof Fireball){
                            character.first_ab.ignite = true
                        }
                    },
                    cost: 1,
                    desc: 'your fireball ignites the floor after explosion'
                },
                {
                    name: 'hand of frost',
                    type: 'frost sphere',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.first_ab instanceof FrostSphere) && !character.first_ab.frost_rich
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.first_ab instanceof FrostSphere){
                            character.first_ab.frost_rich = true
                        }
                    },
                    cost: 1,
                    desc: 'increases radius of explosion'
                },
                {
                    name: 'reign of frost',
                    type: 'frost sphere',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.first_ab instanceof FrostSphere) && !character.first_ab.reign_of_frost
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.first_ab instanceof FrostSphere){
                            character.first_ab.reign_of_frost = true
                        }
                    },
                    cost: 1,
                    desc: 'increases freeze duration'
                },
                {
                    name: 'high voltage',
                    type: 'lightning bolt',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.first_ab instanceof LightningBolt) && !character.first_ab.high_voltage
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.first_ab instanceof LightningBolt){
                            character.first_ab.high_voltage = true
                        }
                    },
                    cost: 1,
                    desc: 'now your lightning bolt does not apply shock and hit up to 3 targets by default also number of hitting enemies is increased by might'
                },
                {
                    name: 'storm',
                    type: 'lightning bolt',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.first_ab instanceof LightningBolt) && !character.first_ab.storm
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.first_ab instanceof LightningBolt){
                            character.first_ab.storm = true
                            character.first_ab.cost += 1
                        }
                    },
                    cost: 1,
                    desc: 'now your lightning bolt also hit 2 additional times in close area but mana cost is increased'
                },
                {
                    name: 'improved chain reaction',
                    type: 'forking lightning',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.second_ab instanceof ForkedLightning) && !character.second_ab.improved_chain_reaction
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.second_ab instanceof ForkedLightning){
                            character.second_ab.improved_chain_reaction = true
                        }
                    },
                    cost: 1,
                    desc: 'increases the chain chance'
                },
                {
                    name: 'lightning eye',
                    type: 'forking lightning',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.second_ab instanceof ForkedLightning) && !character.second_ab.lightning_eye
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.second_ab instanceof ForkedLightning){
                            character.second_ab.lightning_eye = true
                        }
                    },
                    cost: 1,
                    desc: 'increases the radius of checking targets for chain'
                },
                {
                    name: 'lightning waves',
                    type: 'light beacon',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.third_ab instanceof LightBeacon) && !character.third_ab.lightning_waves
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.third_ab instanceof LightBeacon){
                            character.third_ab.lightning_waves = true
                        }
                    },
                    cost: 1,
                    desc: 'now you crates wavas of electricity instead lightnings'
                },
                {
                    name: 'air form',
                    type: 'light beacon',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.third_ab instanceof LightBeacon) && !character.third_ab.air_form
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.third_ab instanceof LightBeacon){
                            character.third_ab.air_form = true
                        }
                    },
                    cost: 1,
                    desc: 'after cast you cant take damage for 3 seconds'
                },
                {
                    name: 'ice genesis',
                    type: 'frostnova',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.third_ab instanceof Frostnova) && !character.third_ab.ice_genesis
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.third_ab instanceof Frostnova){
                            character.third_ab.ice_genesis = true
                        }
                    },
                    cost: 1,
                    desc: 'if you kill the enemy there is a chance to create frost sphere'
                },
                {
                    name: 'cold spires',
                    type: 'frostnova',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.third_ab instanceof Frostnova) && !character.third_ab.cold_spires
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.third_ab instanceof Frostnova){
                            character.third_ab.cold_spires = true
                        }
                    },
                    cost: 1,
                    desc: 'after cast you create a cold spires which freeze enemies and explodes'
                },
                {
                    name: 'hand cuffing',
                    type: 'static field',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.utility instanceof StaticField) && !character.utility.hand_cuffing
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.utility instanceof StaticField){
                            character.utility.hand_cuffing = true
                        }
                    },
                    cost: 1,
                    desc: 'targets cant attack'
                },
                {
                    name: 'collapse',
                    type: 'static field',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.utility instanceof StaticField) && !character.utility.hand_cuffing
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.utility instanceof StaticField){
                            character.utility.hand_cuffing = true
                        }
                    },
                    cost: 1,
                    desc: 'targets take damage after duration'
                },
                {
                    name: 'protected teleportation',
                    type: 'teleportation',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.utility instanceof Teleportation) && !character.utility.protected
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.utility instanceof Teleportation){
                            character.utility.protected = true
                        }
                    },
                    cost: 1,
                    desc: 'you cannot take damage after you start teleportating'
                },
                {
                    name: 'increased gate',
                    type: 'teleportation',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.utility instanceof Teleportation) && !character.utility.increased_gate
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.utility instanceof Teleportation){
                            character.utility.increased_gate = true
                        }
                    },
                    cost: 1,
                    desc: 'increases radius of end point'
                },
                {
                    name: 'mana regen while defend',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && !character.allow_mana_regen_while_def
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && !character.allow_mana_regen_while_def){
                            character.allow_mana_regen_while_def = true
                        }
                    },
                    cost: 1,
                    desc: 'you can regen mana while you are defended'
                },
                {
                    name: 'charged shield',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && !character.charged_shield
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && !character.charged_shield){
                            character.charged_shield = true
                        }
                    },
                    cost: 1,
                    desc: 'there is a chance to create lightning when you block damage while you are defended'
                },
                {
                    name: 'annihilator beam',
                    type: 'new ability',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && !(character.second_ab instanceof AnnihilatorBeam)
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer){
                            character.second_ab = new AnnihilatorBeam(character)
                            character.updateClientSkill()
                        }
                    },
                    cost: 1,
                    desc: 'creates a beam of energy which burn enemies'
                },
                {
                    name: 'light stream',
                    type: '(annihilator beam)',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && character.second_ab instanceof AnnihilatorBeam
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.second_ab instanceof AnnihilatorBeam){
                            character.second_ab.cost -= 2
                        }
                    },
                    cost: 1,
                    desc: 'reduses mana cost'
                },
                {
                    name: 'concentrating energy',
                    type: '(annihilator beam)',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && character.second_ab instanceof AnnihilatorBeam
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && !character.second_ab.concentrating_energy){
                            character.second_ab.concentrating_energy = true
                        }
                    },
                    cost: 1,
                    desc: 'now it ignores armour'
                },
                {
                    name: 'mental shield',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && !character.mental_shield
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer){
                            character.mental_shield = true
                        }
                    },
                    cost: 1,
                    desc: 'courage increase your armour rate'
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

        this.upgrades = filtered
    }


    castSound(){
        this.level.sounds.push({
            name: 'cast',
            x: this.x,
            y: this.y
        })
    }
    getMoveSpeed(): number{
        let total_inc = this.move_speed_penalty

        let speed = this.move_speed + (this.speed / 40)

        if(!total_inc) return speed
        if(total_inc > 100) total_inc = 100
        if(total_inc < -90) total_inc = -90
       
        return speed * (1 + total_inc / 100)
    }
 
    applyStats(stats: any){
        for(let stat in stats){
            this[stat] = stats[stat]
        }

        this.max_resource += this.knowledge
    }

    createAbilities(abilities: any){
        let main_name = abilities.find(elem => elem.type === 1 && elem.selected).name

        if(main_name === 'frost sphere'){
            this.first_ab = new FrostSphere(this)
        }
        else if(main_name === 'fireball'){
            this.first_ab = new Fireball(this)
        }
        else if(main_name === 'lightning bolt'){
            this.first_ab = new LightningBolt(this)
        }

      
        let secondary_name = abilities.find(elem => elem.type === 2 && elem.selected).name

        if(secondary_name === 'forked lightning'){
            this.second_ab = new ForkedLightning(this)
        }
        else if(secondary_name === 'flamewall'){
            this.second_ab = new FlameWall(this)
        }

      

        let finisher_name = abilities.find(elem => elem.type === 3 && elem.selected).name

        if(finisher_name === 'light beacon'){
            this.third_ab = new LightBeacon(this)
        }
        else if(finisher_name === 'frost nova'){
            this.third_ab = new Frostnova(this)
        }
        
        let utility_name = abilities.find(elem => elem.type === 4 && elem.selected).name

        if(utility_name === 'teleportaion'){
            this.utility = new Teleportation(this)
        }
        else if(utility_name === 'static field'){
            this.utility = new StaticField(this)
        }
    }

    setDefend(){
        this.state = 'defend'
        this.stateAct = this.defendAct

        if(!this.allow_mana_regen_while_def){
            this.can_regen_resource = false
        }
        
        if(this.takeoff){
            this.phasing = true
        }

        this.cancelAct = () => {
            this.can_regen_resource = true
            this.phasing = false
        }
    }

    getMoveSpeedPenaltyValue(){
        return 70 - (this.agility * 5);
    }

    defendAct(){
        if(!this.pressed[' ']){
            this.getState()
            this.can_regen_resource = true
        }
    }
    
    takeDamage(unit: any = undefined, options: any){
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

        if(this.state === 'defend' && this.resource > 0){

            if(this.charged_shield && Func.chance(50)){
                let target = this.level.enemies[Math.floor(Math.random() * this.level.enemies.length)]
                if(target){
                    let proj = new Lightning(this.level)
                    proj.setOwner(this)
                    proj.setAngle(Func.angle(this.x, this.y, target.x, target.y))
                    proj.setPoint(this.x, this.y)

                    this.level.projectiles.push(proj)
                }
            }

            if(!Func.chance(this.will * 5)){
                this.resource --
            }
            
            return
        }

        let arm = this.armour_rate + (this.agility * 3) + (this.mental_shield ? this.getSecondResource() * 3 : 0)

        arm = arm > 95 ? 95 : arm

        if(Func.chance(arm)){
            let e = new Armour(this.level)
            e.setPoint(Func.random(this.x - 2, this.x + 2), this.y)
            e.z = Func.random(2, 8)

            this.level.effects.push(e)

            return
        }

        let e = new Blood(this.level)
        e.setPoint(Func.random(this.x - 2, this.x + 2), this.y)
        e.z = Func.random(2, 8)
        this.level.effects.push(e)

        this.recent_cast = this.recent_cast.filter((elem, index) => index >= 4)
        this.subLife(unit, options)
    }

    subLife(unit: any = undefined, options = {}){
        this.life_status --

        if(Func.chance(this.fragility)){
            this.life_status --
        }

        if(this.life_status <= 0){
            this.playerTakeLethalDamage()

            if(this.can_be_lethaled){
                if(options?.explode){
                    this.exploded = true
                }
                this.is_dead = true
                unit?.succesefulKill()
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
                this.addMoveSpeedPenalty(-10)
            }
            else if(this.life_status === 1){
                this.addMoveSpeedPenalty(-30)
                this.reachNearDead()
            }
        }
    }

    getSkipDamageStateChance(){
        return this.avoid_damaged_state_chance + this.durability * 7
    }

    getRegenTimer(){
        return 15000 - this.durability * 500
    }

    getManaRegenTimer(){
        return 5000 - this.getSecondResource() * 100
    }

    startGame(){
        let time = Date.now()
        this.item?.equip(this)
        this.next_life_regen_time = time + this.getRegenTimer()
        this.next_mana_regen_time = time + this.getManaRegenTimer()
        this.check_recent_hits_timer = time + 1000
    }


    regen(){
        if(this.time >= this.check_recent_hits_timer){
            this.check_recent_hits_timer += 1000

            for(let i = this.recent_cast.length; i >= 0; i--){
                let hit_time = this.recent_cast[i]
                // todo timer
                if(this.time - hit_time >= 8000){
                    this.recent_cast.splice(i, 1);
                }
            }
        }

        if(this.time >= this.next_life_regen_time){
            this.next_life_regen_time += this.getRegenTimer()
            
            this.addLife()
        }
        if(this.time >= this.next_mana_regen_time){
            this.next_mana_regen_time += this.getManaRegenTimer()

            if(this.can_regen_resource && !this.is_dead){
                this.addResourse()
            }
        }
    }

    addResourse(count: number = 1, ignore_limit = false){
        if(!this.can_regen_resource) return
        
        if(this.resource < this.max_resource || ignore_limit){
            this.resource += count
        }
        
        if(this.resource < this.max_resource && Func.chance(this.will * 5)){
            this.resource ++
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

    payCost(){
        let chance = this.knowledge * 2

        if(chance > 70){
            chance = 70
        }

        if(!Func.chance(chance)){
            this.resource -= this.pay_to_cost
        }
        
        this.pay_to_cost = 0
        if(this.second_ab){
            this.second_ab.used = false
        }
    }

    addCourage(){
        if(!this.can_get_courage) return

        this.recent_cast.push(this.time)

        if(this.can_be_enlighten && this.recent_cast.length >= 8){
            this.can_be_enlighten = false

            this.enlight()

            setTimeout(() => {
                this.can_be_enlighten = true
            }, this.getEnlightenTimer())
        }

        if(Func.chance(this.speed * 2.5)){
            this.recent_cast.push(this.time)
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

        this.level.players.forEach((elem) => {
            elem.addResourse(5, true)
        })
    }

    getSecondResource(){
        return this.recent_cast.length
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

    getCastSpeed() {
        return this.cast_speed - this.getSecondResource() * 50
    }

    useSecond(){
        if(!this.can_use_skills) return
        
        if(this.third_ab?.canUse()){
            this.useNotUtilityTriggers.forEach(elem => {
                elem.trigger(this)
            })
            this.third_ab?.use()
            this.last_skill_used_time = this.time
              
        }
        else if(this.second_ab?.canUse()){
            this.useNotUtilityTriggers.forEach(elem => {
                elem.trigger(this)
            })
            this.second_ab.use()
            this.last_skill_used_time = this.time
        }  
    }
}