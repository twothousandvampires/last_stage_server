import Fireball from "../../../Abilities/Flyer/Fireball";
import FlameWall from "../../../Abilities/Flyer/FlameWall";
import ForkedLightning from "../../../Abilities/Flyer/ForkedLightning";
import Frostnova from "../../../Abilities/Flyer/Frostnova";
import FrostSphere from "../../../Abilities/Flyer/FrostSphere";
import LightBeacon from "../../../Abilities/Flyer/LightBeacon";
import LightningBolt from "../../../Abilities/Flyer/LightningBolt";
import Sparks from "../../../Abilities/Flyer/Sparks";
import StaticField from "../../../Abilities/Flyer/StaticField";
import Teleportation from "../../../Abilities/Flyer/Teleportation";
import Upgrades from "../../../Classes/Upgrades";
import Func from "../../../Func";
import Level from "../../../Level";
import FlyerDefendState from "../../../State/FlyerDefendState";
import PlayerDyingState from "../../../State/PlayerDyingState";
import Accumulation from "../../../Triggers/Accumulation";
import FragilityWhenHitTrigger from "../../../Triggers/FragilityWhenHitTrigger";
import Upgrade from "../../../Types/Upgrade";
import Armour from "../../Effects/Armour";
import Blood from "../../Effects/Blood";
import ToothExplode from "../../Effects/ToothExplode";
import { Lightning } from "../../Projectiles/Lightning";
import Character from "../Character";
import Unit from "../Unit";

export default class Flyer extends Character{

    static MIN_CAST_SPEED: number = 150

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
        this.steps = false
        this.cast_speed = 1500
        this.name = 'flyer'
        this.move_speed = 0.45
        this.chance_to_avoid_damage_state = 0
        this.armour_rate = 0
        this.resource = 0
        this.maximum_resources = 7
        this.base_regeneration_time = 11000
        this.takeoff = false
        this.allow_mana_regen_while_def = false
        this.charged_shield = false
        this.mental_shield = false
        this.recent_cast = []
        this.chance_to_block = 100
        this.enlightenment_threshold = 9
    }

    getAdditionalRadius(){
        return Math.floor(this.might / 2)
    }

    getDefendState(){
        return new FlyerDefendState()
    }

    generateUpgrades(ascend_level: number){
        if(!this.can_generate_upgrades) return
        if(this.upgrades.length) return

        //get all upgrades for this class
        let p = Upgrades.getAllUpgrades()
        let all: Upgrade[] = Upgrades.getFlyerUpgrades().concat(p)
       
        //filter by usability
        let filtered = all.filter(elem => {
            return (!elem.ascend || this.ascend_level >= elem.ascend) && elem.cost <= this.grace && elem.canUse(this)
        })

        filtered.forEach(elem => {
            if(elem.ascend === undefined){
                elem.ascend = 0
            }
        })

        filtered.sort((a, b) =>  { return (b.cost + b.ascend) - (a.cost + a.ascend)})
        
        let part_size = Math.ceil(filtered.length / 3);

        let part1 = filtered.slice(0, part_size);
        let part2 = filtered.slice(part_size, part_size * 2);
        let part3 = filtered.slice(part_size * 2);

        this.upgrades = this.upgrades.concat(Func.getRandomFromArray(part1))
        this.upgrades = this.upgrades.concat(Func.getRandomFromArray(part2))
        this.upgrades = this.upgrades.concat(Func.getRandomFromArray(part3))

        this.upgrades = this.upgrades.filter(elem => elem)
    }

    castSound(){
        this.level.sounds.push({
            name: 'cast',
            x: this.x,
            y: this.y
        })
    }

    getMoveSpeed(): number{
        let total_inc = this.move_speed_penalty + this.agility

        if(total_inc === 0) return this.move_speed

        if(total_inc > 200) total_inc = 200
        if(total_inc < -95) total_inc = -95
       
        return this.move_speed * (1 + total_inc / 100)
    }
 
    applyStats(stats: any){
        for(let stat in stats){
            this[stat] = stats[stat]
        }

        this.maximum_resources += this.knowledge
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

        if(utility_name === 'teleportation'){
            this.utility = new Teleportation(this)
        }
        else if(utility_name === 'static field'){
            this.utility = new StaticField(this)
        }

        let passive = abilities.find(elem => elem.type === 5 && elem.selected)

        if(passive){
            if(passive.name === 'disintegration'){
                this.triggers_on_hit.push(new FragilityWhenHitTrigger(10))
            }
            if(passive.name === 'accumulation'){
                this.triggers_on_use_not_utility.push(new Accumulation())
            }
        }
    }

    getCdRedaction(){
        return this.cooldown_redaction + this.might
    }

    setDefend(){
        this.state = 'defend'
        this.stateAct = this.defendAct
        this.triggers_on_start_block.forEach(elem => elem.trigger(this))

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
        let pen = 70 - (this.perception * 2)
        if(pen < 0){
            pen = 0
        } 

        return pen  
    }

    defendAct(){
        if(!this.pressed[32]){
            this.getState()
            this.can_regen_resource = true
        }
    }

    isBlock(): boolean {
        return this.state === 'defend' && this.resource > 0 && Func.chance(this.chance_to_block, this.is_lucky)
    }

    isArmourHit(unit: Unit){
        let p = 0
        
        if(unit){
            p = unit.pierce
        }

        let total = this.getTotalArmour()

        if(p >= total) return false

        let arm = total - p

        if(arm > 95){
            arm = 95
        }

        return Func.chance(arm, this.is_lucky)
    }

    public succesefulBlock(unit: Unit | undefined): void{
        if(Func.notChance(this.will * 4, this.is_lucky)){
            this.resource --
        }
        this.triggers_on_block.forEach(elem => elem.trigger(this, unit))
    }
    
    takeDamage(unit: any = undefined, options: any){
        if(!this.can_be_damaged) return
        
        if(options?.instant_death){
            unit?.succesefulKill()
            this.is_dead = true
            this.life_status = 0
            this.setState(new PlayerDyingState())
            this.level.playerDead()
            return
        }

        if(this.damaged || this.is_dead) return

        if(this.ward){
            let count = 1
            if(unit && Func.chance(unit.critical)){
                count ++
            }
            this.loseWard(count)
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

        if(this.isSpiritBlock()){
            this.resource --
            return
        }

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

            this.succesefulBlock(unit)
            
            return
        }

        if(this.isArmourHit(unit)){
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

        this.recent_cast = this.recent_cast.filter((elem, index) => index >= 4)
        this.subLife(unit, options)
    }

    getTotalArmour(){
        return this.armour_rate + (this.agility * 3) + (this.mental_shield ? this.getSecondResource() * 3 : 0)
    }

    getPenaltyByLifeStatus(){
        if(this.life_status === 2){
            return 10
        }
        else if(this.life_status === 1){
            return 30
        }
        else{
            return 0
        }
    }

    getSkipDamageStateChance(){
        return this.chance_to_avoid_damage_state + this.durability * 7
    }

    getRegenTimer(){
        return 15000 - this.durability * 500
    }

    getManaRegenTimer(){
        return 5000 - this.getSecondResource() * 25
    }

    startGame(){
        let time = Date.now()
        this.equipItems()
        this.next_life_regen_time = time + this.getRegenTimer()
        this.next_mana_regen_time = time + this.getManaRegenTimer()
        this.check_recent_hits_timer = time + 1000
    }

    isSecondTrigger(){
        return this.chance_to_trigger_additional_time + this.will
    }

    getStatDescription(stat: string){
        if(stat === 'might'){
            return `Affects your abilities (increases AOE, number of projectiles, etc.).
                        Reduces cooldowns of your abilities.`
        }
        if(stat === 'will'){
            return `Gives a chance not to lose mana when block.
                       Gives a chance to get additional energy.
                       Increases a chance that trigger trigered twice.`
        }
        if(stat === 'agility'){
            return `Increases your armour.
                          - increases your move speed.`
        }
        if(stat === 'knowledge'){
            return `Gives a chance not to spend mana when used.
                            Affect to start maximum energy.
                            Increases your power`
        }
        if(stat === 'durability'){
            return `Gives a chance to avoid damage state.
                             Increases life regeneration rate.`
        }
        if(stat === 'perception'){
            return `Reduces penalty of speed when your cast.
                             Gives a chance to get additional courage.`
        }
        
        return ''
    }

    regen(){
        if(this.level.time >= this.check_recent_hits_timer){
            this.check_recent_hits_timer += 1000

            for(let i = this.recent_cast.length; i >= 0; i--){
                let hit_time = this.recent_cast[i]
                // todo timer
                if(this.level.time - hit_time >= this.courage_expire_timer){
                    this.recent_cast.splice(i, 1);
                }
            }

            this.sayPhrase()
        }

        if(this.level.time >= this.next_life_regen_time){
            this.next_life_regen_time += this.getRegenTimer()
            
            this.addLife()
        }
        if(this.level.time >= this.next_mana_regen_time){
            this.next_mana_regen_time += this.getManaRegenTimer()

            if(this.can_regen_resource && !this.is_dead){
                this.addResourse()
            }
        }
    }

    addResourse(count: number = 1, ignore_limit = false){
        
        if(!this.can_regen_resource) return
        
        this.playerGetResourse()

        if(this.resource < this.maximum_resources || ignore_limit){
            this.resource += count
        }
        
        if(this.resource < this.maximum_resources && Func.chance(this.will * 5, this.is_lucky)){
            this.resource ++
        }
    }

    setDamagedAct(){
        this.damaged = true
        this.state = 'damaged'
        this.can_be_controlled_by_player = false
        this.stateAct = this.damagedAct

        this.cancelAct = () => {
            this.can_be_controlled_by_player = true
            this.damaged = false
        }

        this.setTimerToGetState(300)
    }

    succefullCast(){
        this.addCourage()
    }

    getPower(): number {
        return this.power + this.knowledge
    }

    payCost(){
        if(this.pay_to_cost === 0) return

        if(this.free_cast){
            this.pay_to_cost = 0
            this.free_cast = false
            return
        }
        
        let chance = this.knowledge

        if(chance > 70){
            chance = 70
        }

        if(Func.notChance(chance, this.is_lucky)){
            this.resource -= this.pay_to_cost
        }
        
        this.pay_to_cost = 0
        if(this.resource < 0){
            this.resource = 0
        }
    }

    addCourage(){
        if(!this.can_get_courage) return

        this.recent_cast.push(this.level.time)

        if(this.can_be_enlighten && this.recent_cast.length >= this.enlightenment_threshold){
            this.can_be_enlighten = false

            this.enlight()

            setTimeout(() => {
                this.can_be_enlighten = true
            }, this.getEnlightenTimer())
        }

        if(Func.chance(this.perception * 2.5, this.is_lucky)){
            this.recent_cast.push(this.level.time)
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

        this.playerWasEnlighted()
        this.level.addSound('enlight', this.x, this.y)
    }

    getSecondResource(){
        return this.recent_cast.length
    }

    getCastSpeed() {
        let value = this.cast_speed - (this.getSecondResource() * 12)
        
        if(value < Flyer.MIN_CAST_SPEED){
            value = Flyer.MIN_CAST_SPEED
        }

        return value

    }
}