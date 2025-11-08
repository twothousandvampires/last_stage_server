import Ability from "../../Abilities/Ability"
import Builder from "../../Classes/Builder"
import UpgradeManager from "../../Classes/UpgradeManager"
import Func from "../../Func"
import FallingStones from "../../Glyphs/FallingStones"
import HolyStrike from "../../Glyphs/HolyStrike"
import Mastery from "../../Glyphs/Mastery"
import Recovery from "../../Glyphs/Recovery"
import TornadoLaunch from "../../Glyphs/TornadoLaunch"
import VoidDevouring from "../../Glyphs/VoidDevouring"
import WaveOfTransformation from "../../Glyphs/WaveOfTransformation"
import WindBarrier from "../../Glyphs/WindBarrier"
import IUnitState from "../../Interfaces/IUnitState"
import Item from "../../Items/Item"
import item from "../../Items/Item"
import Level from "../../Level"
import PlayerDamagedState from "../../State/PlayerDamagedState"
import PlayerDeadState from "../../State/PlayerDeadState"
import PlayerDefendState from "../../State/PlayerDefendState"
import PlayerDyingState from "../../State/PlayerDyingState"
import PlayerIdleState from "../../State/PlayerIdleState"
import Status from "../../Status/Status"
import Sound from "../../Types/Sound"
import Upgrade from "../../Types/Upgrade"
import Effect from "../Effects/Effects"
import Grace from "../Effects/Grace"
import SmallTextLanguage1 from "../Effects/SmallTextLanguage1"
import Ward from "../Effects/Ward"
import Enemy from "./Enemy/Enemy"
import Unit from "./Unit"

export default abstract class Character extends Unit {

    static MAX_ITEMS_TO_PURCHASE: number = 3
  
    action_end_time: number = 0
    pressed: { [key: string]: any, } = {}
    angle_for_forced_movement: number | undefined
    c_x: number = 0
    c_y: number = 0
    purchased_items: number = 0

    first_ability: Ability | undefined
    second_ability: Ability | undefined
    third_ability: Ability | undefined
    utility: Ability | undefined
    passive: any
    item: item[] = []
    masteries: Mastery[] = []

    max_items: number = 6
    start_move_time: number = 0
    end_move_time: number = 0
    last_time_the_skill_was_used: number | undefined
    last_steps_time: number = 0
    last_impact_time: number = 0
    last_hit_time: number = 0
    last_time_get_hit: number = 0
    dead_time: number = 0

    knowledge: number = 0
    perception: number = 0
    agility: number = 0
    will: number = 0
    durability: number = 0
    might: number = 0

    enlight_timer: number = 35000
    base_regeneration_time: number = 10000
    grace: number = 1
    voice_radius: number = 20
    gold: number = 0
    cooldown_redaction: number = 0
    max_life: number = 4
    maximum_resources: number = 7
    resource: number = 0
    crushing_rating: number = 0
    crushing_cd: number = 2000
    last_crashing_time = 0
    impact: number = 0
    impact_cooldown: number = 2000 
    cast_speed: number = 2000
    status_resistance: number = 5
    spirit: number = 0

    is_lucky: boolean = false
    steps: boolean = true
    lust_for_life: boolean = false
    blessed: boolean = false
    spirit_strikes: boolean = false
    free_upgrade_count: number = 0
     
    triggers_on_kill: any[] = []
    triggers_on_hit: any[] = []
    triggers_on_use_not_utility: any[] = []
    triggers_on_near_dead: any[] = []
    triggers_on_player_dead: any[] = []
    triggers_on_lethal_damage: any[] = []
    triggers_on_get_hit: any[] = []
    triggers_on_heal: any[] = []
    triggers_on_status_resist: any[] = []
    triggers_on_block: any[] = []
    triggers_on_say: any[] = []
    triggers_on_lose_life: any[] = []
    triggers_on_get_energy: any = []
    triggers_on_start_block: any = []
    triggers_on_enemy_die: any = []
    triggers_on_pierce: any = []
    triggers_on_armour_hit: any = []
    triggers_on_critical: any[] = []
    triggers_on_enlight: any[] = []
    triggers_on_impact: any[] = []

    chance_to_instant_kill: number = 0
    chance_to_avoid_damage_state: number = 0
    chance_to_say_phrase: number = 1
    chance_to_get_additional_gold: number = 0
    chance_to_block: number = 0
    chance_to_create_grace: number = 0

    enlightenment_threshold: number = 12
    can_get_courage: boolean = true
    can_be_controlled_by_player: boolean = true
    can_be_lethaled: boolean = true
    can_regen_resource: boolean = true
    can_regen_life: boolean = true
    can_use_skills: boolean = true
    can_generate_upgrades: boolean = true
    can_be_enlighten: boolean = true
    can_regen_more_life_chance: number = 0
    can_attack: boolean = true
    can_cast: boolean = true
    can_block: boolean = true
    can_ressurect: boolean = false
    ascend_level: number = 0
    courage_expire_timer: number = 8000
    last_ascent_mastery_getting: number = 0

    current_state: IUnitState<Character> | undefined

    spend_grace: boolean = false
    target: string | undefined
    a: number = 0.2
  
    upgrades: any[] = []
    free_cast: boolean = false
    
    pay_to_cost: number = 0
    after_grace_statuses: Status[] = []
    
    using_ability: any
    items_to_buy: Item[] = []

    constructor(level: Level){
        super(level)
        this.box_r = 2.5
        this.light_r = 16
        this.life_status = 4
        this.getState()
    }

    abstract startGame(): void
    abstract createAbilities(abilities: any): void
    abstract takeDamage(unut: Unit | undefined, options: object): void
    abstract getSkipDamageStateChance(): number
    abstract regen(): void
    abstract getSecondResource(): number
    abstract isBlock(): boolean
    abstract getPenaltyByLifeStatus(): number
    abstract getTotalArmour(): number
    abstract getMoveSpeedPenaltyValue(): number
    abstract addCourage(): void
    abstract getRegenTimer(): number
    abstract getPower(): number
    
    succesefulPierce(enemy: Unit): void {
        this.triggers_on_pierce.forEach(elem => elem.trigger(this, enemy))
    }

    impactHit(enemy: any = undefined, impact_damage: number = 1){
        this.triggers_on_impact.forEach(elem => elem.trigger(this, enemy, impact_damage))
    }

    isCrushing(){
        if(Func.chance(this.crushing_rating, this.is_lucky)){
            if(this.level.time - this.last_crashing_time >= this.crushing_cd){
                this.last_crashing_time = this.level.time
                return true
            }
            else{
                return false
            }
        }
        else{
            return false
        }       
    }

    playerGetResourse(){
        this.triggers_on_get_energy.forEach(elem => elem.trigger(this))
    }

    getCastSpeed(){
        return this.cast_speed
    }

    getPierce(){
        return this.pierce
    }

    succesefulArmourBlock(target: Unit){
        this.triggers_on_armour_hit.forEach(elem => elem.trigger(this, target))
    }

    useAbility(ability: Ability){
        this.using_ability = ability
        this.pay_to_cost = ability.cost
        this.useNotUtility()

        ability.use(this)  
    }

    useNotUtility(): void{
        this.triggers_on_use_not_utility.forEach(elem => {
            elem.trigger(this)
        })

        this.last_time_the_skill_was_used = this.level.time
        this.sayPhrase()
    }

    getImpactRating(){
        let base = this.impact

        if(this.spirit_strikes){
            base += this.ward
        }

        return base
    }

    toJSON(){
        return {
            abilities: [this.first_ability.name, this.second_ability?.name, this.third_ability?.name, this.utility?.name],
            can_use: [this.first_ability.canUse(), this.second_ability.canUse(), this.third_ability.canUse(), this.utility.canUse()],
            resource: this.resource,
            maximum_resources: this.maximum_resources,
            life_status: this.life_status,
            life: this.life_status,
            x: this.x,
            y: this.y,
            id: this.id,
            state: this.state,
            flipped: this.flipped,
            name: this.name,
            z: this.z,
            action_time: this.action_time,
            light_r: this.light_r,
            ward: this.ward,
            invisible: this.invisible,
            courage: this.getSecondResource(),
            max_courage: this.enlightenment_threshold
        }
    }

    isSpiritBlock(){
        if(this.resource <= 0) return false

        return Func.chance(this.spirit, this.is_lucky)
    }

    succesefulCritical(enemy: Enemy): void{
        this.triggers_on_critical.forEach(elem => elem.trigger(this, enemy))
    }

    getIdleState(){
        return new PlayerIdleState()
    }


    protected equipItems(){
        this.item.forEach(elem => {
            elem.setPlayer(this)
        })
    }

    public succesefulBlock(unit: Unit | undefined): void{
        this.triggers_on_block.forEach(elem => elem.trigger(this, unit))
    }

    getResistValue(): number{
        return this.status_resistance
    }

    public isStatusResist(): boolean{
        let chacne = this.getResistValue()
        if(chacne > 95){
            chacne = 95
        }
        let result = Func.chance(chacne, this.is_lucky)
        return result
    }

    protected getEnlightenTimer(): number{
        return this.enlight_timer
    }

    playerWasEnlighted(){
        this.triggers_on_enlight.forEach(elem => {
            elem.trigger(this)
        })
    }

    getStatsArray(){
        return [
            'might',
            'will',
            'knowledge',
            'agility',
            'perception',
            'durability'
        ]
    }

    protected payCost(): void {
        this.resource -= this.pay_to_cost
        this.pay_to_cost = 0
        
        if(this.resource < 0){
            this.resource = 0
        }
    }

    public statusWasApplied(): void{
        
    }

    public addGold(value: number = 1): void{
        this.gold += value

        if(Func.chance(this.chance_to_get_additional_gold, this.is_lucky)){
            this.gold ++
        }
    }

    public sayPhrase(): void{
        if(!Func.chance(this.chance_to_say_phrase)) return

        let phrase = new SmallTextLanguage1(this.level)
        phrase.z = 12
        phrase.setPoint(this.x, this.y)

        this.triggers_on_say.forEach(elem => {
            elem.trigger(this)
        })

        this.level.effects.push(phrase)
    }

    public getMoveSpeedReduceWhenUseSkill(): number{
        return 70
    }
    
    getAttackSpeed(){
        return this.attack_speed
    }

    getStats(){ 
        let descriptions = {
            might: this.getStatDescription('might'),
            will: this.getStatDescription('will'),
            agility: this.getStatDescription('agility'),
            knowledge: this.getStatDescription('knowledge'),
            perception: this.getStatDescription('perception'),
            durability: this.getStatDescription('durability'),
            armour: 'Increases your chance of not taking damage.',
            resist: 'Increases your chance of not geting bad status(ignite, shock, etc).',
            spirit: 'Increases your chance of losing energy instead of life.',
            pierce: 'Increases your chance to deal damage by reducing enemy armour.',
            impact: 'Increases your chance to damage adjacent targets in addition to your primary target.',
            critical: 'Increases your chance to deal double damage.',
            crushing: 'Increases your chance to crush an enemy, every time when enemy being crushed they take additional damage next time.',
            power: 'Gives a chance to increase damage by 1 after all calculations',
            fortification: 'Gives a chance to reduce damage by 1 before critical calculation    '
        }
        return {
            stats: {
                might: this.might,
                will: this.will,
                knowledge: this.knowledge,
                durability: this.durability,
                agility: this.agility,
                perception: this.perception,
                "~~~": "~~~~~~~~~~~~~~~~~",
                armour: this.getTotalArmour(),
                resist: this.getResistValue() + '%',
                spirit: this.spirit + '%',
                fortification: this.fortify + '%',
                "~~~~~~~~~~~~~~~~~": "~~~",
                "attack speed": this.getAttackSpeed() + 'ms',
                "cast speed": this.getCastSpeed() + 'ms',
                pierce: this.getPierce() +'%',
                impact: this.getImpactRating() + '%',
                critical: this.critical + '%',
                crushing: this.crushing_rating + '%', 
                "~~": "~~~~~~~~~~~~~~~~~~",
                "move speed": this.move_speed_penalty + '%',
                "cooldown reduction": this.getCdRedaction() + '%',
                "regeneration rate": (this.getRegenTimer() / 1000) + 'sec',
                power: this.getPower(),
            },
            descriptions: descriptions
        }
    }

    public takePureDamage(value: number = 1): void{
        this.subLife(undefined, {
            damage_value: value
        })
    }

    public removeUpgrades(): void{
        this.upgrades.length = 0
    }

    public addWard(value: number = 1){
        if(this.ward <= 0){
            let e = new Ward(this.level)

            e.setOwner(this)
            e.setPoint(this.x, this.y)

            this.level.binded_effects.push(e)
        }

        this.ward += value
    }

    public loseWard(value: number = 1){
        this.ward -= value

        if(this.ward <= 0){
            this.ward = 0
            let e = this.level.binded_effects.find(elem => elem.owner = this && elem instanceof Ward)

            if(e){
                this.level.binded_effects = this.level.binded_effects.filter(elem => elem != e)
                this.level.deleted.push(e.id)
            }
        }
    }

    public upgrade(upgrade_name: string): void{
        let upgrade: Upgrade = this.upgrades.find(elem => elem.name === upgrade_name)
        if(!upgrade) return

        upgrade.teach(this)
        
        if(this.free_upgrade_count){
            this.free_upgrade_count --
        }
        else{
            this.grace -= upgrade.cost
            this.spend_grace = true

            if(upgrade.cost){
                this.addAscent()
            }
        }
        
        this.level.addSound('upgrade', this.x, this.y)
        
        this.removeUpgrades()
        UpgradeManager.closeUpgrades(this)
    }

    addAscent(value = 1){
        this.ascend_level += value

        let diff = this.ascend_level - this.last_ascent_mastery_getting

        while(diff >= 15){
            this.last_ascent_mastery_getting += 15
            this.masteries.push(Builder.createRandomMastery())
            
            diff = this.ascend_level - this.last_ascent_mastery_getting
        }
    }

    public exitGrace(): void{
        this.can_generate_upgrades = true
        let portal: Effect | undefined = this.level.binded_effects.find(elem => elem.name === 'grace')

        if(portal instanceof Grace){
            portal.playerLeave(this)
        }
    }

    updateClientSkill(): void{
        let data = [
            {
                type: 'first',
                name: this?.first_ability?.name
            },
            {
                type: 'secondary',
                name: this?.second_ability?.name
            },
            {
                type: 'finisher',
                name: this?.third_ability?.name
            },
            {
                type: 'utility',
                name: this?.utility?.name
            }
        ]
        this.level.socket.to(this.id).emit('update_skill', data)
    }

    public setZone(zone_id: number, x: number, y: number): void{
        this.zone_id = zone_id
        this.x = x
        this.y = y

        this.level.socket.to(this.id).emit('change_level', this.zone_id, x, y)
    }

    isRegenAdditionalLife(){
        return false
    }
    
    canRegenMoreLife(){
        return Func.chance(this.can_regen_more_life_chance, this.is_lucky) || (this.lust_for_life && Func.chance(this.getSecondResource() * 4, this.is_lucky))
    }

    public addLife(count: number = 1, ignore_poison: boolean = false, ignore_limit: boolean = false): void{
        if(!this.can_regen_life && !ignore_poison) return
        
        if(this.isRegenAdditionalLife()){
            count ++
        }

        for(let i = 0; i < count; i++){
            let previous = this.life_status

            if(previous >= this.max_life){
                if(previous === this.max_life && (ignore_limit || this.canRegenMoreLife())){

                }
                else{
                    return
                } 
            }
            let penalty = this.getPenaltyByLifeStatus()
            this.addMoveSpeedPenalty(penalty)

            this.life_status ++
        }

        this.playerWasHealed()
    }

    public playerWasHealed(): void{
        this.triggers_on_heal.forEach(elem => {
            elem.trigger(this)
        })
    }

    protected getWeaponHitedSound(): Sound{
        return {
            name: 'sword hit',
            x: this.x,
            y: this.y
        }
    }

    public statusWasResisted(status: Status | undefined){
        this.triggers_on_status_resist.forEach(elem => {
            elem.trigger(this, status)
        })
    }

    protected subLife(unit: any = undefined, options: any): void{

        let value = 1

        if(options?.damage_value){
            value = options.damage_value
        }

        if(value <= 0) {
            return
        }
       
        if(unit && unit.pierce > this.getTotalArmour() && Func.chance(unit.pierce - this.getTotalArmour())){
            value ++
        }

        if(Func.chance(this.fortify)){
            value --
        }

        if(unit && Func.chance(unit.critical)){
            console.log('player was critical')
            value *= 2
        }

        if(this.fragility){
            console.log('player was fragle')
            value *= 2
        }

        if(unit && Func.chance(unit.power)){
            value ++
        }
      
        if(value > 0){
            this.last_time_get_hit = this.level.time

            for(let i = 0; i < value; i++){
                if(this.life_status <= 0) continue

                this.life_status --

                if(this.life_status === 1){
                    this.reachNearDead()
                }

                if(this.life_status <= 0){
                    this.playerTakeLethalDamage()

                    if(this.can_be_lethaled){
                        if(options?.explode){
                            this.exploded = true
                        }
                        if(unit instanceof Character){
                            unit.succesefulKill(this)
                        }
                        this.is_dead = true
                        this.setState(new PlayerDyingState())
                    }
                }
           
                let penalty = -this.getPenaltyByLifeStatus()
                this.addMoveSpeedPenalty(penalty) 
            }

            if(this.is_dead) return

            if(this.life_status > 0){
                this.playerLoseLife()
            }

            if(!this.can_be_lethaled){
                this.life_status = 1
                this.can_be_lethaled = true
            }

            if(!this.freezed && Func.notChance(this.getSkipDamageStateChance(), this.is_lucky)){
                this.setState(new PlayerDamagedState())
            }
        }
    }

    playerLoseLife(){
        this.triggers_on_lose_life.forEach(elem => {
            elem.trigger(this)
        })
    }
    
    protected playerWasHited(unit: Unit | undefined): void{
        this.triggers_on_get_hit.forEach(elem => {
            elem.trigger(this, unit)
        })

        this.sayPhrase()
    }

    public playerTakeLethalDamage(): void{
        this.triggers_on_lethal_damage.forEach(elem => {
            elem.trigger(this)
        })
    }

    public playerDead(): void{
        this.triggers_on_player_dead.forEach(elem => {
            elem.trigger(this)
        })
    }

    public reachNearDead(): void{
        this.triggers_on_near_dead.forEach(elem => {
            elem.trigger(this)
        })
    }

    public succesefulKill(enemy): void{
        this.triggers_on_kill.forEach(elem => {
            elem.trigger(this, enemy)
        })
    }

    public succesefulHit(target = undefined): void{
        this.triggers_on_hit.forEach(elem => {
            elem.trigger(this, target)
        })

        this.last_hit_time = this.level.time
    }

    public applyStats(stats: any): void{
        for(let stat in stats){
            if(typeof stats[stat] === 'number'){
                let stat_value = stats[stat]
                switch (stat){
                    case 'might':
                        this.might = stat_value
                        break;
                    case 'will':
                        this.will = stat_value
                        break;
                    case 'perception':
                        this.perception = stat_value
                        break;
                    case 'agility':
                        this.agility = stat_value
                        break;
                    case 'durability':
                        this.durability = stat_value
                        break;
                    case 'knowledge':
                        this.knowledge = stat_value
                        break;
                }
            }
        }
    }

    public setTarget(id: string): void{
        if(!this.target){
            this.target = id
        }
    }   

    protected reaA(): void{
        if(this.a <= 0){
            this.a = 0
            return
        }
        this.a = 0.005
    }

    protected incA(): void{
        if(this.a >= 1){
            return
        }

        if(this.a <= 0){
            this.a = 0.005
        }
        else{
            this.a *= 2
        }
        
        if(this.a >= 1){
            this.a = 1
        }
    }

    public getTarget(): Unit | undefined {
        if(!this.target) return undefined

        let t = this.level.enemies.find(elem => elem.id === this.target)
                        
        if(!t){
            t = this.level.players.find(elem => elem.id === this.target && elem.id != this.id)
        }

        if(t){
            return t
        }

        return undefined
    }
    
    protected canMove(): boolean{
        return !this.freezed && !this.zaped
    }

    enemyDeadNearby(enemy: Enemy){
        this.triggers_on_enemy_die.forEach(elem => {
            elem.trigger(this, enemy)
        })
    }

    private directMove(): void{
        console.log(this.angle_for_forced_movement)
        if(this.canMove()){
            this.incA()
            this.is_moving = true
            if(this.state === 'idle'){
                this.state = 'move'
            }
        }
        else if(!this.canMove()){
            this.reaA()
            this.is_moving = false
            if(this.state === 'move'){
                this.state = 'idle'
            }
            return
        }
        
        let a = this.angle_for_forced_movement

        if(!a) {
            return
        }

        let l: number = 1 - Math.abs(0.5 * Math.cos(a))

        let next_step_x = Math.sin(a) * l
        let next_step_y = Math.cos(a) * l
        
        let speed = this.getMoveSpeed()

        if(next_step_x < 0 && !this.is_attacking){
            this.flipped = true
        }
        else if(!this.is_attacking && next_step_x > 0){
            this.flipped = false
        }

        next_step_x *= speed
        next_step_y *= speed

        next_step_x *= this.a
        next_step_y *= this.a

        let coll_e_x = undefined
        let coll_e_y = undefined
        
        let x_coll = false
        let y_coll = false

        if(!this.phasing){
            for(let i = 0; i < this.level.enemies.length; i++){

                let enemy = this.level.enemies[i]
                if(enemy.phasing) continue

                if(Func.elipseCollision(this.getBoxElipse(next_step_x, 0), enemy.getBoxElipse())){
                    x_coll = true
                    next_step_x = 0
                    coll_e_x = enemy
                    if(y_coll){
                        break
                    }
                }
                
                if(Func.elipseCollision(this.getBoxElipse(0, next_step_y), enemy.getBoxElipse())){
                    y_coll = true
                    next_step_y = 0
                    coll_e_y = enemy
                    if(x_coll){
                        break
                    }
                }
            }
        }
        
        if(!this.isOutOfMap(this.x + next_step_x, this.y + next_step_y)){
            if(x_coll && next_step_y === 0){
                if(this.y <= coll_e_x.y){
                    next_step_y = - 0.2
                }
                else{
                    next_step_y = 0.2
                }
            }

            if(y_coll && next_step_x === 0){
                if(this.x <= coll_e_y.x){
                    next_step_x = -0.2
                }
                else{
                    next_step_x = 0.2
                }
            }

            this.addToPoint(next_step_x, next_step_y)
        }
    }

    private moveAct(tick: number): void{
        if(this.angle_for_forced_movement){
            this.directMove()
            return
        }
        if(this.moveIsPressed() && this.canMove()){
            this.incA()
            if(!this.is_moving){
                this.is_moving = true
                this.start_move_time = tick
            }
            if(this.state === 'idle'){
                this.state = 'move'
            }
        }
        else if(!this.moveIsPressed() || !this.canMove()){
            this.reaA()
            if(this.is_moving){
                this.is_moving = false
                this.end_move_time = tick
            }
            if(this.state === 'move'){
                this.state = 'idle'
            }
            return
        }
    
        let next_step_x = 0
        let next_step_y = 0

        if(this.pressed[87]){
            next_step_y = -1
        }
        if(this.pressed[83]){
            next_step_y = 1
        }
        if(this.pressed[68]){
            next_step_x = 1
        }
        if(this.pressed[65]){
            next_step_x = -1
            }

        if(next_step_x != 0 && next_step_y != 0){
            next_step_x *= 0.67
            next_step_y *= 0.67
        }

        if(next_step_x < 0 && !this.is_attacking){
            this.flipped = true
        }
        else if(!this.is_attacking && next_step_x > 0){
            this.flipped = false
        }

        next_step_y *= 0.5

        let speed = this.getMoveSpeed()

        next_step_x *= speed
        next_step_y *= speed

        next_step_x *= this.a
        next_step_y *= this.a

        let coll_e_x = undefined
        let coll_e_y = undefined
        
        let x_coll = false
        let y_coll = false

        if(!this.phasing){
            for(let i = 0; i < this.level.enemies.length; i++){

                let enemy = this.level.enemies[i]

                if(enemy.phasing) continue
                if(enemy.is_dead) continue

                if(Func.elipseCollision(this.getBoxElipse(next_step_x, 0), enemy.getBoxElipse())){
                    x_coll = true
                    next_step_x = 0
                    coll_e_x = enemy
                    if(y_coll){
                        break
                    }
                }
                
                if(Func.elipseCollision(this.getBoxElipse(0, next_step_y), enemy.getBoxElipse())){
                    y_coll = true
                    next_step_y = 0
                    coll_e_y = enemy
                    if(x_coll){
                        break
                    }
                }
            }
        }

        if(!this.isOutOfMap(this.x + next_step_x, this.y + next_step_y)){
            if(x_coll && next_step_y === 0){
                if(this.y <= coll_e_x.y){
                    next_step_y = - 0.2
                }
                else{
                    next_step_y = 0.2
                }
            }

            if(y_coll && next_step_x === 0){
                if(this.x <= coll_e_y.x){
                    next_step_x = -0.2
                }
                else{
                    next_step_x = 0.2
                }
            }

            this.addToPoint(next_step_x, next_step_y)
        }
    }

    public newStatus(status: any): void{
        this.level.socket.to(this.id).emit('new_status', status)
    }

    private moveIsPressed(): boolean{
        return this.pressed[87] || this.pressed[83] || this.pressed[65] || this.pressed[68]
    }

    succefullCast(){
        
    }

    prepareToAction(){
        this.is_attacking = true

        let rel_x =  Math.round(this.pressed.canvas_x + this.x - 40)
        let rel_y =  Math.round(this.pressed.canvas_y + this.y - 40)

        
        this.c_x = rel_x
        this.c_y = rel_y  
        
        if(!this.c_x || this.c_y){
            this.c_x = Math.round(this.pressed.over_x + this.x - 40)
            this.c_y = Math.round(this.pressed.over_y + this.y - 40)
        }

        if(rel_x < this.x){
            this.flipped = true
        }
        else{
            this.flipped = false    
        }

        if(!this.attack_angle){
            this.attack_angle = Func.angle(this.x, this.y, rel_x, rel_y)
        }
    }

    getCdRedaction(){
        return this.cooldown_redaction
    }

    getMoveSpeedReduceWhenBlock(){
        return 80
    }

    getDefendState(){
        return new PlayerDefendState()
    }

    public act(time: number): void {
        if(this.can_block && this.can_be_controlled_by_player && this.pressed[32]){
            this.setState(this.getDefendState())
        }
        
        if(this.current_state){
            this.current_state.update(this, time)
        }
      
        if(!this.is_dead){
            this.moveAct(time)
            this.regen()
        }
       
        if(this.action_impact && time >= this.action_impact){
            if(!this.action){
                this.action = true
            }
            else{
                this.action = false
                this.action_impact = 0
            }
        }
        if(!this.action && this.action_end_time && time >= this.action_end_time){
            if(!this.action_is_end){
                this.action_is_end = true
            }
            else{
                this.action_is_end = false
                this.action_end_time = 0
            }
        }
    }

    setState(newState: IUnitState<Character>): void {
        if(this.current_state){
            this.current_state.exit(this)
        }
        if(newState){
            this.current_state = newState
            this.current_state.enter(this)
        }
    }

    public getState(): void {
        this.using_ability = undefined
        this.action_is_end = false
        this.attack_angle = undefined
    
        this.is_attacking = false
        this.action = false
        this.target = undefined
        this.hit = false

        if(this.is_dead){
            this.setState(new PlayerDeadState())
        }
        else{
            this.setState(new PlayerIdleState())
        }
    }

    public setLastInputs(pressed: object): void{
        if(!this.can_be_controlled_by_player){
            this.pressed = {}
        }
        else{
            this.pressed = pressed
        }
    }

    public emitStatusEnd(name: string): void{
        this.level.socket.to(this.id).emit('status_end', name)
    }
}