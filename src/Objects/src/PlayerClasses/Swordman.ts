import Charge from "../../../Abilities/Swordman/Charge";
import Commands from "../../../Abilities/Swordman/Commands";
import CursedWeapon from "../../../Abilities/Swordman/CursedWeapon";
import Jump from "../../../Abilities/Swordman/Jump";
import Quake from "../../../Abilities/Swordman/Quake";
import WeaponSwing from "../../../Abilities/Swordman/WeaponSwing";
import WeaponThrow from "../../../Abilities/Swordman/WeaponThrow";
import Whirlwind from "../../../Abilities/Swordman/Whirlwind";
import Func from "../../../Func";
import Level from "../../../Level";
import Armour from "../../Effects/Armour";
import Blood from "../../Effects/Blood";
import ToothExplode from "../../Effects/ToothExplode";
import Character from "../Character";
import SpectralSwords from "../../../Abilities/Swordman/SpectralSwords";
import Dash from "../../../Abilities/Swordman/Dash";
import MetalThorns from "../../../Abilities/Swordman/MetalThorns";
import Unit from "../Unit";
import Upgrades from "../../../Classes/Upgrades";
import InnerPowerTrigger from "../../../Triggers/InnerPowerTrigger";
import HeavenIntervention from "../../../Triggers/HeavenIntervention";
import HeavenWrath from "../../../Abilities/Swordman/HeavenWrath";
import Upgrade from "../../../Types/Upgrade";

export default class Swordman extends Character{
    
    static MIN_ATTACK_SPEED = 150
    static MAX_ARMOUR = 90

    weapon_angle: number
    resource: number
    maximum_resources: number
    next_life_regen_time: any
    recent_kills: any[]
    check_recent_hits_timer: any
    energy_by_hit_added: boolean = false

    constructor(level: Level){
        super(level)
       
        this.enlightenment_threshold = 12 
        this.weapon_angle = 1
        this.attack_radius = 8
        this.name = 'swordman'
        this.move_speed = 0.5
        this.chance_to_avoid_damage_state = 10
        this.armour_rate = 15
        this.resource = 0
        this.maximum_resources = 7

        // this.impact = 100
        // this.pierce = 100
        this.attack_speed = 1450

        this.base_regeneration_time = 9000
        this.recent_kills = []
        this.chance_to_block = 50
    }

    succefullCast(){
        this.energy_by_hit_added = false
    }

    getTargetsCount(){
        return this.might + 1
    }

    getMoveSpeedReduceWhenBlock(){
        return 80 - this.agility * 5
    }

    addCourage(){
        if(!this.can_get_courage) return

        if(Func.chance(this.knowledge * 3, this.is_lucky)){
            this.recent_kills.push(this.level.time)
        }
        this.recent_kills.push(this.level.time)

        if(this.can_be_enlighten && this.recent_kills.length >= this.enlightenment_threshold){
            this.can_be_enlighten = false

            this.enlight()

            setTimeout(() => {
                this.can_be_enlighten = true
            }, this.getEnlightenTimer())
        }
    }

    succesefulKill(enemy){
        this.triggers_on_kill.forEach(elem => {
            elem.trigger(this, enemy)
        })

        this.addCourage()   
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

        this.addLife()
        this.attack_speed -= 500

        setTimeout(() => {
            this.attack_speed += 500
        },3000)

        this.level.addSound('enlight', this.x, this.y)
        this.playerWasEnlighted()
    }

    getCdRedaction(){
        return this.cooldown_redaction + this.will
    }

    applyStats(stats: any){
        for(let stat in stats){
            this[stat] = stats[stat]
        }

        this.maximum_resources += this.perception
    }

    createAbilities(abilities: any){
        
        let main_name = abilities.find(elem => elem.type === 1 && elem.selected).name

        if(main_name === 'swing'){
            this.first_ability = new WeaponSwing(this)
        }
        else if(main_name === 'weapon throw'){
            this.first_ability = new WeaponThrow(this)
        }
        else if(main_name === 'dash'){
            this.first_ability = new Dash(this)
        }

        let secondary_name = abilities.find(elem => elem.type === 2 && elem.selected).name

        if(secondary_name === 'jump'){
            this.second_ability = new Jump(this)
        }
        else if(secondary_name === 'charge'){
            this.second_ability = new Charge(this)
        }
        else if(secondary_name === 'metal thorns'){
            this.second_ability = new MetalThorns(this)
        }
       

        let finisher_name = abilities.find(elem => elem.type === 3 && elem.selected).name

        if(finisher_name === 'whirlwind'){
            this.third_ability = new Whirlwind(this)
        }
        else if(finisher_name === 'quake'){
            this.third_ability = new Quake(this)
        }
        else if(finisher_name === 'spectral swords'){
            this.third_ability = new SpectralSwords(this)
        }
        else if(finisher_name === 'heaven wrath'){
            this.third_ability = new HeavenWrath(this)
        }
    
        let utility_name = abilities.find(elem => elem.type === 4 && elem.selected).name

        if(utility_name === 'cursed weapon'){
            this.utility = new CursedWeapon(this)
        }
        else if(utility_name === 'commands'){
            this.utility = new Commands(this)
        }

        let passive_name = abilities.find(elem => elem.type === 5 && elem.selected).name

        if(passive_name === 'inner power'){
            this.triggers_on_near_dead.push(new InnerPowerTrigger())
        }

        if(passive_name === 'heaven intervention'){
            this.triggers_on_get_hit.push(new HeavenIntervention())
        }
    }

    isBlock(crush: number = 0): boolean {
        let b_chance = this.chance_to_block + this.perception * 3

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

        if(arm > 95){
            arm = 95
        }

        return Func.chance(arm, this.is_lucky)
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
        }

        this.playerWasHited(unit)

        if(this.isSpiritBlock()){
            this.resource --
            return
        }

        if(this.isBlock()){
            this.level.sounds.push({
                name: 'metal hit',
                x: this.x,
                y: this.y
            })

            this.succesefulBlock(unit)

            return
        } 
        
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

        if(Func.notChance(this.might * 7, this.is_lucky)){
            this.recent_kills = this.recent_kills.filter((elem, index) => index >= 5)
        }
       
        this.subLife(unit, options)
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

    getTotalArmour(){
        return this.armour_rate + this.durability
    }

    getSkipDamageStateChance(){
        return this.chance_to_avoid_damage_state + this.will * 5
    }

    getRegenTimer(){
        return this.base_regeneration_time - this.will * 150
    }

    getPierce(){
        return this.pierce + this.might
    }

    generateUpgrades(){
        if(!this.can_generate_upgrades) return
        if(this.upgrades.length) return

        //get all upgrades for this class
        let p = Upgrades.getAllUpgrades()
        let all: Upgrade[] = Upgrades.getSwordmanUpgrades().concat(p)
       
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

    startGame(){
        let time = Date.now()
        this.equipItems()
        this.next_life_regen_time = time + this.getRegenTimer()
        this.check_recent_hits_timer = time + 1000
    }

    getSecondResourceTimer(){
        return this.courage_expire_timer
    }

    regen(){
        let second_resouce_timer = this.getSecondResourceTimer()

        if(this.level.time >= this.check_recent_hits_timer){
            this.check_recent_hits_timer += 1000

            for(let i = this.recent_kills.length; i >= 0; i--){
                let hit_time = this.recent_kills[i]

                if(this.level.time - hit_time >= second_resouce_timer){
                    this.recent_kills.splice(i, 1);
                }
            }

            this.sayPhrase()
        }

        if(this.level.time >= this.next_life_regen_time){
            this.next_life_regen_time += this.getRegenTimer()
            
            this.addLife()
        }
    }

    isRegenAdditionalLife(){
        return Func.chance(this.durability, this.is_lucky)
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

    getResistValue(): number{
        return this.status_resistance + (this.knowledge * 2)
    }

    getSecondResource(){
        return this.recent_kills.length
    }

    getMoveSpeedPenaltyValue(){
        return 70 - (this.perception * 3)
    }

    getAttackSpeed() {
        let value = this.attack_speed - (this.agility * 25) - (this.getSecondResource() * 20)
        
        if(value < Swordman.MIN_ATTACK_SPEED){
            value = Swordman.MIN_ATTACK_SPEED
        }

        return value
    }

    payCost(){
        if(this.free_cast){
            this.pay_to_cost = 0
            this.free_cast = false
            return
        }
        this.resource -= this.pay_to_cost
        this.pay_to_cost = 0 
    }

    addResourse(count: number = 1, ignore_limit = false){
        if(!this.can_regen_resource) return
        this.playerGetResourse()

        if(!this.can_regen_resource) return

        if(this.resource >= this.maximum_resources && !ignore_limit){
            return
        }
    
        this.resource += count
    }

    addPoint(count: number = 1, ignore_limit = false){
        if(this.energy_by_hit_added) return
        this.playerGetResourse()

        if(this.resource >= this.maximum_resources){
            return
        }

        if(Func.chance(this.knowledge * 4, this.is_lucky)){
            count ++
        }

        this.resource += count
        if(this.resource > this.maximum_resources){
            this.resource = this.maximum_resources
        }

        this.energy_by_hit_added = true
    }

    setDefend(){
        this.state = 'defend'
        this.stateAct = this.defendAct

        this.triggers_on_start_block.forEach(elem => elem.trigger(this))
    
        let reduce = 80 - this.agility * 5
        if(reduce < 0){
            reduce = 0
        }
        this.addMoveSpeedPenalty(-reduce)

        this.cancelAct = () => {
            this.addMoveSpeedPenalty(reduce)
        }
    }
}