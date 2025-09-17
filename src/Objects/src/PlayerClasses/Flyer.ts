import AnnihilatorBeam from "../../../Abilities/Flyer/AnnihilatorBeam";
import Fireball from "../../../Abilities/Flyer/Fireball";
import FlameWall from "../../../Abilities/Flyer/FlameWall";
import ForkedLightning from "../../../Abilities/Flyer/ForkedLightning";
import Frostnova from "../../../Abilities/Flyer/Frostnova";
import FrostSphere from "../../../Abilities/Flyer/FrostSphere";
import LightBeacon from "../../../Abilities/Flyer/LightBeacon";
import LightningBolt from "../../../Abilities/Flyer/LightningBolt";
import Sparks from "../../../Abilities/Flyer/Sparks";
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
        this.base_regen_time = 12000
        this.takeoff = false
        this.allow_mana_regen_while_def = false
        this.charged_shield = false
        this.mental_shield = false
        this.recent_cast = []
        this.block_chance = 100
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
                        return character.second_ability instanceof FlameWall && !character.second_ability.scorching
                    },
                    teach: (character: Character) => {
                        if(character && character.second_ability instanceof FlameWall){
                            character.second_ability.scorching = true
                        }
                    },
                    cost: 3,
                    desc: 'your flamewall burn faster'
                },
                {
                    name: 'frendly flame',
                    type: '(flame wall)',
                    canUse: (character: Character) => {
                        return character.second_ability instanceof FlameWall && !character.second_ability.frendly_flame
                    },
                    teach: (character: Character) => {
                        character.second_ability.frendly_flame = true
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
                    cost: 2,
                    desc: 'gives your phasing while you are defended'
                },
                 {
                    name: 'teeth',
                    type: 'new ability',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && !(character.first_ability instanceof Teeth)
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer){
                            character.first_ability = new Teeth(character)
                            character.updateClientSkill()
                        }
                    },
                    cost: 5,
                    desc: 'fires a sereral of teeth'
                },
                {
                    name: 'body melting',
                    type: 'fireball',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.first_ability instanceof Fireball) && !character.first_ability.body_melting
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.first_ability instanceof Fireball){
                            character.first_ability.body_melting = true
                        }
                    },
                    cost: 2,
                    desc: 'gives your fireball a chance to pierce the enemy'
                },
                {
                    name: 'ignite',
                    type: 'fireball',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.first_ability instanceof Fireball) && !character.first_ability.ignite
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.first_ability instanceof Fireball){
                            character.first_ability.ignite = true
                        }
                    },
                    cost: 3,
                    desc: 'your fireball ignites the floor after explosion'
                },
                {
                    name: 'hand of frost',
                    type: 'frost sphere',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.first_ability instanceof FrostSphere) && !character.first_ability.frost_rich
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.first_ability instanceof FrostSphere){
                            character.first_ability.frost_rich = true
                        }
                    },
                    cost: 1,
                    desc: 'increases radius of explosion'
                },
                {
                    name: 'reign of frost',
                    type: 'frost sphere',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.first_ability instanceof FrostSphere) && !character.first_ability.reign_of_frost
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.first_ability instanceof FrostSphere){
                            character.first_ability.reign_of_frost = true
                        }
                    },
                    cost: 1,
                    desc: 'increases freeze duration'
                },
                {
                    name: 'high voltage',
                    type: 'lightning bolt',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.first_ability instanceof LightningBolt) && !character.first_ability.high_voltage
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.first_ability instanceof LightningBolt){
                            character.first_ability.high_voltage = true
                        }
                    },
                    cost: 2,
                    desc: 'now your lightning bolt does not apply shock and hit up to 3 targets by default also number of hitting enemies is increased by might'
                },
                {
                    name: 'storm',
                    type: 'lightning bolt',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.first_ability instanceof LightningBolt) && !character.first_ability.storm
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.first_ability instanceof LightningBolt){
                            character.first_ability.storm = true
                            character.first_ability.cost += 1
                        }
                    },
                    cost: 2,
                    desc: 'now your lightning bolt also hit 2 additional times in close area but mana cost is increased'
                },
                {
                    name: 'improved chain reaction',
                    type: 'forking lightning',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.second_ability instanceof ForkedLightning) && !character.second_ability.improved_chain_reaction
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.second_ability instanceof ForkedLightning){
                            character.second_ability.improved_chain_reaction = true
                        }
                    },
                    cost: 2,
                    desc: 'increases the chain chance'
                },
                {
                    name: 'lightning eye',
                    type: 'forking lightning',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.second_ability instanceof ForkedLightning) && !character.second_ability.lightning_eye
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.second_ability instanceof ForkedLightning){
                            character.second_ability.lightning_eye = true
                        }
                    },
                    cost: 1,
                    desc: 'increases the radius of checking targets for chain'
                },
                {
                    name: 'lightning waves',
                    type: 'light beacon',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.third_ability instanceof LightBeacon) && !character.third_ability.lightning_waves
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.third_ability instanceof LightBeacon){
                            character.third_ability.lightning_waves = true
                        }
                    },
                    cost: 4,
                    desc: 'now you crates wavas of electricity instead lightnings'
                },
                {
                    name: 'air form',
                    type: 'light beacon',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.third_ability instanceof LightBeacon) && !character.third_ability.air_form
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.third_ability instanceof LightBeacon){
                            character.third_ability.air_form = true
                        }
                    },
                    cost: 2,
                    desc: 'after cast you cant take damage for 3 seconds'
                },
                {
                    name: 'ice genesis',
                    type: 'frostnova',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.third_ability instanceof Frostnova) && !character.third_ability.ice_genesis
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.third_ability instanceof Frostnova){
                            character.third_ability.ice_genesis = true
                        }
                    },
                    cost: 5,
                    desc: 'if you kill the enemy there is a chance to create frost sphere'
                },
                {
                    name: 'cold spires',
                    type: 'frostnova',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && (character.third_ability instanceof Frostnova) && !character.third_ability.cold_spires
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.third_ability instanceof Frostnova){
                            character.third_ability.cold_spires = true
                        }
                    },
                    cost: 5,
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
                        return character instanceof Flyer && (character.utility instanceof StaticField) && !character.utility.collapse
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.utility instanceof StaticField){
                            character.utility.collapse = true
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
                    cost: 5,
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
                        return character instanceof Flyer && !(character.second_ability instanceof AnnihilatorBeam)
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer){
                            character.second_ability = new AnnihilatorBeam(character)
                            character.updateClientSkill()
                        }
                    },
                    cost: 3,
                    desc: 'creates a beam of energy which burn enemies'
                },
                {
                    name: 'light stream',
                    type: 'annihilator beam',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && character.second_ability instanceof AnnihilatorBeam
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && character.second_ability instanceof AnnihilatorBeam){
                            character.second_ability.cost -= 2
                        }
                    },
                    cost: 1,
                    desc: 'reduses mana cost'
                },
                {
                    name: 'concentrating energy',
                    type: 'annihilator beam',
                    canUse: (character: Character) => {
                        return character instanceof Flyer && character.second_ability instanceof AnnihilatorBeam
                    },
                    teach: (character: Character) => {
                        if(character instanceof Flyer && !character.second_ability.concentrating_energy){
                            character.second_ability.concentrating_energy = true
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
                {
                    name: 'penetrating lightning',
                    type: 'sparks',
                    canUse: (character: Character) => {
                        return character.third_ability instanceof Sparks && character.third_ability.pierce < 3
                    },
                    teach: (character: Character) => {
                        if(character.third_ability instanceof Sparks){
                            character.third_ability.pierce ++
                        }
                    },
                    cost: 3,
                    desc: 'increases the number of enemies your sparks can pass through'
                },
                {
                    name: 'strong sparks',
                    type: 'sparks',
                    canUse: (character: Character) => {
                        return character.third_ability instanceof Sparks && character.third_ability.ttl < 10000
                    },
                    teach: (character: Character) => {
                        if(character.third_ability instanceof Sparks){
                            character.third_ability.ttl += 2000
                        }
                    },
                    cost: 3,
                    desc: 'increases the duration'
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
        let total_inc = this.move_speed_penalty + this.speed

        if(total_inc === 0) return this.move_speed

        if(total_inc > 200) total_inc = 200
        if(total_inc < -95) total_inc = -95
       
        return this.move_speed * (1 + total_inc / 100)
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
            this.first_ability = new FrostSphere(this)
        }
        else if(main_name === 'fireball'){
            this.first_ability = new Fireball(this)
        }
        else if(main_name === 'lightning bolt'){
            this.first_ability = new LightningBolt(this)
        }

      
        let secondary_name = abilities.find(elem => elem.type === 2 && elem.selected).name

        if(secondary_name === 'forked lightning'){
            this.second_ability = new ForkedLightning(this)
        }
        else if(secondary_name === 'flamewall'){
            this.second_ability = new FlameWall(this)
        }

      

        let finisher_name = abilities.find(elem => elem.type === 3 && elem.selected).name

        if(finisher_name === 'light beacon'){
            this.third_ability = new LightBeacon(this)
        }
        else if(finisher_name === 'frost nova'){
            this.third_ability = new Frostnova(this)
        }
        else if(finisher_name === 'sparks'){
            this.third_ability = new Sparks(this)
        }
        
        let utility_name = abilities.find(elem => elem.type === 4 && elem.selected).name

        if(utility_name === 'teleportaion'){
            this.utility = new Teleportation(this)
        }
        else if(utility_name === 'static field'){
            this.utility = new StaticField(this)
        }
    }

    getCdRedaction(){
        return this.cd_reduction + this.might
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
        if(!this.pressed[32]){
            this.getState()
            this.can_regen_resource = true
        }
    }

    isBlock(): boolean {
        return this.state === 'defend' && this.resource > 0 && Func.chance(this.block_chance, this.is_lucky)
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
            if(this.charged_shield && Func.chance(75, this.is_lucky)){
                let target = this.level.enemies[Math.floor(Math.random() * this.level.enemies.length)]

                if(target){
                    let proj = new Lightning(this.level)
                    proj.setOwner(this)
                    proj.setAngle(Func.angle(this.x, this.y, target.x, target.y))
                    proj.setPoint(this.x, this.y)

                    this.level.projectiles.push(proj)
                }
            }

            if(Func.notChance(this.will * 4, this.is_lucky)){
                this.resource --
            }

            this.succesefulBlock(unit)
            
            return
        }

        let arm = this.armour_rate + (this.agility * 3) + (this.mental_shield ? this.getSecondResource() * 3 : 0)

        arm = arm > 95 ? 95 : arm

        if(!this.no_armour && Func.chance(arm, this.is_lucky)){
            let e = new Armour(this.level)
            e.setPoint(Func.random(this.x - 2, this.x + 2), this.y)
            e.z = Func.random(2, 8)

            this.level.effects.push(e)

            return
        }

        if(Func.chance(30)){
            this.level.addSound('get hit', this.x, this.y)
        }

        let e = new Blood(this.level)
        e.setPoint(Func.random(this.x - 2, this.x + 2), this.y)
        e.z = Func.random(2, 8)
        this.level.effects.push(e)

        this.recent_cast = this.recent_cast.filter((elem, index) => index >= 4)
        this.subLife(unit, options)
        this.playerLoseLife()
    }

    subLife(unit: any = undefined, options = {}){
        this.life_status --

        if(Func.notChance(100 - this.fragility, this.is_lucky)){
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
            if(!this.freezed && Func.notChance(this.getSkipDamageStateChance(), this.is_lucky)){
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
        this.equipItems()
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

            this.sayPhrase()
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
        
        super.addResourse()

        if(this.resource < this.max_resource || ignore_limit){
            this.resource += count
        }
        
        if(this.resource < this.max_resource && Func.chance(this.will * 5, this.is_lucky)){
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

        if(Func.notChance(chance, this.is_lucky)){
            this.resource -= this.pay_to_cost
        }
        
        this.pay_to_cost = 0

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

        if(Func.chance(this.speed * 2.5, this.is_lucky)){
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

        this.level.addSound('enlight', this.x, this.y)
    }

    getSecondResource(){
        return this.recent_cast.length
    }

    getCastSpeed() {
        return this.cast_speed - this.getSecondResource() * 50
    }
}