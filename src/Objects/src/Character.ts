import Ability from "../../Abilities/Ability"
import Builder from "../../Classes/Builder"
import Func from "../../Func"
import Forging from "../../Items/Forgings/Forging"
import Item from "../../Items/Item"
import item from "../../Items/Item"
import Level from "../../Level"
import BlessedArmour from "../../Status/BlessedArmour"
import Status from "../../Status/Status"
import Touch from "../../Status/Touch"
import WithColdStatus from "../../Status/WithColdStatus"
import WithFireStatus from "../../Status/WithFireStatus"
import WithStormStatus from "../../Status/WithStormStatus"
import Sound from "../../Types/Sound"
import Upgrade from "../../Types/Upgrade"
import Effect from "../Effects/Effects"
import Grace from "../Effects/Grace"
import SmallTextLanguage1 from "../Effects/SmallTextLanguage1"
import Ward from "../Effects/Ward"
import Unit from "./Unit"

export default abstract class Character extends Unit{

    static MAX_ITEMS_TO_BUY: number = 3

    action_end: number = 0
    pressed: { [key: string]: any, } = {}
    can_move_by_player: boolean = true
    direct_angle_to_move: any
    c_x: number = 0
    c_y: number = 0
    buyed_items: number = 0
    max_resource: number = 7
    resource: number = 0
    exploded: boolean = false
    first_ability: Ability | undefined
    second_ability: Ability | undefined
    third_ability: Ability | undefined
    utility: Ability | undefined
    item: item[] = []
    time: number | undefined
    last_skill_used_time: number | undefined
    chance_to_say_phrase: number = 1

    knowledge: number = 0
    agility: number = 0
    speed: number = 0
    will: number = 0
    durability: number = 0
    might: number = 0

    base_regen_time: number = 10000
    grace: number = 1
    can_get_courage: boolean = true

    is_lucky: boolean = false
    can_move: boolean = true

    on_kill_triggers: any[] = []
    on_hit_triggers: any[] = []
    use_not_utility_triggers: any[] = []
    reach_near_dead_triggers: any[] = []
    player_dead_triggers: any[] = []
    player_take_lethal_damage_triggers: any[] = []
    when_hited_triggers: any[] = []
    on_heal_triggers: any[] = []
    on_status_resist_triggers: any[] = []
    when_block_triggers: any[] = []
    when_say_phrase_triggers: any[] = []
    when_lose_life_triggers: any[] = []
    when_gain_energy_triggers: any = []
    when_start_block_triggers: any = []

    avoid_damaged_state_chance: number = 0
    can_be_lethaled: boolean = true
    can_regen_resource: boolean = true
    spend_grace: boolean = false
    target: string | undefined
    a: number = 0.2
    can_regen_life: boolean = true
    can_use_skills: boolean = true
    upgrades: any[] = []
    can_generate_upgrades: boolean = true
    pay_to_cost: number = 0
    time_stopped: boolean = false
    additional_chance_grace_create: number = 0
    killed_by: any
    blessed: boolean = false
    critical: number = 0
    status_resistance: number = 5
    can_attack: boolean = true
    can_cast: boolean = true
    lust_for_life: boolean = false
    can_be_enlighten: boolean = true
    cast_speed: number = 2000
    mad_target: any
    after_grace_statuses: Status[] = []
    gold_find: number = 0

    voice_radius: number = 20
    public gold: number = 0
    public block_chance: number = 0
    cd_reduction: number = 0
    can_block: boolean = true
    no_armour: boolean = false
    using_ability: any
    items_to_buy: Item[] = []

    constructor(level: Level){
        super(level)
        this.box_r = 2.5
        this.light_r = 16
    
        this.getState()
    }

    abstract startGame(): void
    abstract createAbilities(abilities: any): void
    abstract takeDamage(unut: Unit | undefined, options: object): void
    abstract getSkipDamageStateChance(): number
    abstract useUtility(): void
    abstract regen(): void
    abstract getSecondResource(): number
    abstract isBlock(): boolean
   
    addResourse(){
        this.when_gain_energy_triggers.forEach(elem => elem.trigger(this))
    }

    protected useNotUtility(): void{
        this.use_not_utility_triggers.forEach(elem => {
            elem.trigger(this)
        })

        this.last_skill_used_time = this.time
        this.sayPhrase()
    }

    closeForgings(){
        this.level.socket.to(this.id).emit('close_forgings')
    }

    showForgings(){
        this.level.socket.to(this.id).emit('show_forgings', {
            items: this.item,
            gold: this.gold,
            can_buy: this.buyed_items < 2
        })
    }

    toJSON(){
        return {
            resource: this.resource,
            max_resource: this.max_resource,
            life_status: this.life_status,
            first: this.first_ability?.canUse(),
            secondary: this.second_ability?.canUse(),
            finisher: this.third_ability?.canUse(),
            utility: this.utility?.canUse(),
            second: this.getSecondResource(),
            life: this.life_status,
            x: this.x,
            y: this.y,
            id: this.id,
            state: this.state,
            flipped: this.flipped,
            name: this.name,
            z: this.z,
            action: this.action,
            action_time: this.action_time,
            light_r: this.light_r,
            ward: this.ward,
            invisible: this.invisible
        }
    }

    setFreeze(duration: number){
        if(this.is_dead) return
        if(!this.can_be_damaged) return

        if(this.isStatusResist()){
            this.statusWasResisted(undefined)
            return
        }
        
        this.setState(this.setFreezeState)

        this.setTimerToGetState(duration)
    }
    
    protected equipItems(){
        this.item.forEach(elem => {
            elem.setPlayer(this)
        })
    }

    public succesefulBlock(unit: Unit | undefined): void{
        this.when_block_triggers.forEach(elem => elem.trigger(this, unit))
    }

    public isStatusResist(): boolean{
        let result = Func.chance(this.status_resistance, this.is_lucky)
        return result
    }

    protected getEnlightenTimer(): number{
        return 20000
    }

    protected payCost(): void{
        this.resource -= this.pay_to_cost
        this.pay_to_cost = 0
    }

    public statusWasApplied(): void{
        
    }

    public addGold(value: number): void{
        this.gold += value

        if(Func.chance(this.gold_find, this.is_lucky)){
             this.gold ++
        }
    }

    public sayPhrase(): void{
        if(!Func.chance(this.chance_to_say_phrase)) return

        let phrase = new SmallTextLanguage1(this.level)
        phrase.z = 12
        phrase.setPoint(this.x, this.y)

        this.when_say_phrase_triggers.forEach(elem => {
            elem.trigger(this)
        })

        this.level.effects.push(phrase)
    }

    public getMoveSpeedReduceWhenUseSkill(): number{
        return 70
    }
    
    protected getAllUpgrades(): Upgrade[]{
        return [
                {
                    name: 'with storm',
                    type: 'status',
                    canUse: (character: Character) => {
                        return true
                    },
                    teach: (character: Character): void => {
                        let status = new WithStormStatus(character.level.time)
                        status.setPower(0)
                        character.level.setStatus(character, status, true)
                    },
                    cost: 2,
                    desc: 'creates lightning periodically which shocks enemies, upgrade increases frequency and radius of searching enemies'
                },
                {
                    name: 'with fire',
                    type: 'status',
                    canUse: (character: Character) => {
                        return true
                    },
                    teach: (character: Character) => {
                        let status = new WithFireStatus(character.level.time)
                        status.setPower(0)
                        character.level.setStatus(character, status, true)
                    },
                    cost: 2,
                    desc: 'creates flames periodically which burn enemies and players, upgrade increases size of flames and stop damaging players'
                },
                {
                    name: 'with cold',
                    type: 'status',
                    canUse: (character: Character) => {
                        return true
                    },
                    teach: (character: Character) => {
                        let status = new WithColdStatus(character.level.time)
                        status.setPower(0)
                        character.level.setStatus(character, status, true)
                    },
                    cost: 2,
                    desc: 'creates cold explosion periodically which freeze enemies and players, upgrade increases radius and frequency'
                },
                {
                    name: 'increase agility',
                    canUse: (character: Character) => {
                        return character.agility != undefined
                    },
                    teach: (character: Character) => {
                        character.agility ++
                    },
                    cost: 1,
                    desc: 'increases your agility'
                },
                {
                    name: 'increase knowledge',
                    canUse: (character: Character) => {
                        return character.knowledge != undefined
                    },
                    teach: (character: Character) => {
                        character.knowledge ++
                    },
                    cost: 1,
                    desc: 'increases your knowledge'
                },
                {
                    name: 'increase power',
                    canUse: (character: Character) => {
                        return character.might != undefined
                    },
                    teach: (character: Character) => {
                        character.might ++
                    },
                    cost: 1,
                    desc: 'increases your might'
                },
                {
                    name: 'increase durability',
                    canUse: (character: Character) => {
                        return character.durability != undefined
                    },
                    teach: (character: Character) => {
                        character.durability ++
                    },
                    cost: 1,
                    desc: 'increases your durability'
                },
                {
                    name: 'increase will',
                    canUse: (character: Character) => {
                        return character.will != undefined
                    },
                    teach: (character: Character) => {
                        character.will ++
                    },
                    cost: 1,
                    desc: 'increases your will'
                },
                {
                    name: 'increase speed',
                    canUse: (character: Character) => {
                        return character.speed != undefined
                    },
                    teach: (character: Character) => {
                        character.speed ++
                    },
                    cost: 1,
                    desc: 'increases your speed'
                },
                {
                    name: 'heal',
                    canUse: (character: Character) => {
                        return character.life_status < 3
                    },
                    teach: (character: Character) => {
                        character.addLife(3, true, true)
                    },
                    cost: 1,
                    desc: 'give a life'
                },
                {
                    name: 'chosen one',
                    canUse: (character: Character) => {
                        return character.additional_chance_grace_create < 50
                    },
                    teach: (character: Character) => {
                        character.additional_chance_grace_create += 5
                    },
                    cost: 1,
                    desc: 'increases your chance to get grace after enemy dead'
                },
                {
                    name: 'blessed',
                    canUse: (character: Character) => {
                        return !character.blessed
                    },
                    teach: (character: Character) => {
                        character.blessed = true
                    },
                    cost: 2,
                    desc: 'bones killed by your have reduced chance to ressurect'
                },
                 {
                    name: 'pressure',
                    canUse: (character: Character) => {
                        return true
                    },
                    teach: (character: Character) => {
                        character.pierce += 3
                    },
                    cost: 2,
                    desc: 'increases a chance to ignore armour'
                },
                {
                    name: 'critical hit',
                    canUse: (character: Character) => {
                        return character.critical < 100
                    },
                    teach: (character: Character) => {
                        character.critical += 5
                    },
                    cost: 2,
                    desc: 'give a chance to deal double damage'
                },
                {
                    name: 'armour',
                    canUse: (character: Character) => {
                        return true
                    },
                    teach: (character: Character) => {
                        character.armour_rate += 3
                    },
                    cost: 3,
                    desc: 'adds armour rate'
                },
                {
                    name: 'gamble',
                    canUse: (character: Character) => {
                        return character.grace > 1
                    },
                    teach: (character: Character) => {
                        if(Func.chance(35, character.is_lucky)){
                            character.grace *= 2
                        }
                        else{
                            character.grace = Math.floor(character.grace / 2)
                        }
                    },
                    cost: 0,
                    desc: 'lose or get grace'
                },
                {
                    name: 'resist',
                    canUse: (character: Character) => {
                        return character.status_resistance < 50
                    },
                    teach: (character: Character) => {
                        character.status_resistance += 10
                    },
                    cost: 2,
                    desc: 'increases chance to resist status'
                },
                {
                    name: 'lust for life',
                    canUse: (character: Character) => {
                        return !character.lust_for_life
                    },
                    teach: (character: Character) => {
                        character.lust_for_life = true
                    },
                    cost: 4,
                    desc: 'you have a chance based of your courage to regen more than life status limit("good")'
                },
                {
                    name: 'vision',
                    canUse: (character: Character) => {
                        return character.light_r < 30
                    },
                    teach: (character: Character) => {
                        character.light_r += 2
                    },
                    cost: 1,
                    desc: 'increases your vision'
                },
                {
                    name: 'touch',
                    type: 'buff',
                    canUse: (character: Character) => {
                        return character.after_grace_statuses.filter(elem => elem.name === 'touch').length === 0
                    },
                    teach: (character: Character) => {
                        let status = new Touch(character.time)
                        status.setDuration(30000)
                        character.after_grace_statuses.push(status)
                    },
                    cost: 1,
                    desc: 'gives a buff after living grace which increases all stats by 10'
                },
                {
                    name: 'blessed armour',
                    type: 'buff',
                    canUse: (character: Character) => {
                        return character.after_grace_statuses.filter(elem => elem.name === 'blessed armour').length === 0
                    },
                    teach: (character: Character) => {
                        let status = new BlessedArmour(character.time)
                        status.setDuration(30000)
                        character.after_grace_statuses.push(status)
                    },
                    cost: 1,
                    desc: 'gives a buff after living grace which increases all stats by 10'
                },
                {
                    name: 'talkativeness',
                    canUse: (character: Character) => {
                        return character.chance_to_say_phrase < 3
                    },
                    teach: (character: Character) => {
                        return character.chance_to_say_phrase ++
                    },
                    cost: 3,
                    desc: 'increases a chance to say something'
                },
                {
                    name: 'swiftness',
                    canUse: (character: Character) => {
                        return character.cd_reduction < 90
                    },
                    teach: (character: Character) => {
                        return character.cd_reduction += 2
                    },
                    cost: 2,
                    desc: 'reduces cooldowns'
                },
                {
                    name: 'strong ward',
                    canUse: (character: Character) => {
                        return true
                    },
                    teach: (character: Character) => {
                        return character.addWard(10)
                    },
                    cost: 4,
                    desc: 'gives you 10 ward'
                },
        ]
    }

    public takePureDamage(): void{
        this.subLife()
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

        this.grace -= upgrade.cost
        this.spend_grace = true

        this.level.addSound('upgrade', this.x, this.y)
        
        this.removeUpgrades()
        this.closeUpgrades()
    }

    public showUpgrades(): void{
        this.level.socket.to(this.id).emit('show_upgrades', {
            upgrades: this.upgrades,
            grace: this.grace,
            can_hold: !this.spend_grace
        })
    }

    public exitGrace(): void{
        this.can_generate_upgrades = true
        let portal: Effect | undefined = this.level.binded_effects.find(elem => elem.name === 'grace')

        if(portal instanceof Grace){
            portal.playerLeave(this)
        }
    }

    pickForging(item_id, id){
        let item = this.item[item_id]

        item.pick(id)
        item.suggested_forgings = []

        this.closeForgings()
        this.closeSuggest()
    }

    buyItem(id){
        this.gold -= 30

        let item = this.items_to_buy[id]

        item.setPlayer(this)
        
        this.item.push(item)

        this.items_to_buy = []

        this.buyed_items ++

        this.closeForgings()
        this.closeSuggest()
    }

    closeSuggest(){
        this.level.socket.to(this.id).emit('close_suggest')
    }

    public buyNewItem(){
        if(this.gold < 30) return
        if(this.item.buyed_items >= 2) return

        if(this.items_to_buy.length === 0){
            for(let i = 0; i < Character.MAX_ITEMS_TO_BUY; i++){
                let item_name = Item.list[Math.floor(Math.random() * Item.list.length)].name
                let item = Builder.createItem(item_name)

                if(this.item.some(elem => elem.name === item.name)){
                    i--
                }
                else{
                    this.items_to_buy.push(item)
                }
            }
        }

        this.createSuggest(this.items_to_buy)
    }

    createSuggest(data: any){
        this.level.socket.to(this.id).emit('suggest_items', data)
    }
    createSuggestForge(data: any, item_id){
        this.level.socket.to(this.id).emit('suggest_forgings', data , item_id)
    }

    protected updateClientSkill(): void{
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

    public forgeItem(data: any): void{
        let item = this.item.find(elem => elem.name === data.item_name)

        if(!item) return

        let forging: Forging = item.forge[data.forge]

        if(!forging) return

        forging.forge(this)

        this.level.addSound('gold spending', this.x, this.y)

        this.closeForgings()
    }

    public unlockForging(item_name: string): void{
        let item = this.item.find(elem => elem.name === item_name)

        if(!item) return

        let cost = (item.forge.length * 5) + 5

        if(this.gold < cost) return

        if(item.unlockForgings()){
            this.level.addSound('gold spending', this.x, this.y)
            this.gold -= cost
        }
          
        this.createSuggestForge(item.suggested_forgings, this.item.indexOf(item))
    }

    public holdGrace(): void{
        this.can_generate_upgrades = false
        this.grace += 3
        this.closeUpgrades()
    }

    public closeUpgrades(): void{
        this.level.socket.to(this.id).emit('close_upgrades')
    }

    public setZone(zone_id: number, x: number, y: number): void{
        this.zone_id = zone_id
        this.x = x
        this.y = y

        this.level.socket.to(this.id).emit('change_level', this.zone_id, x, y)
    }

    public addLife(count: number = 1, ignore_poison: boolean = false, ignore_limit: boolean = false): void{
        if(!this.can_regen_life && !ignore_poison) return
        
        for(let i = 0; i < count; i++){
            let previous = this.life_status

            if(previous >= 3){
                if(ignore_limit || (this.lust_for_life && Func.chance(this.getSecondResource() * 4, this.is_lucky))){

                }
                else{
                    return
                } 
            }

            this.life_status ++
            this.playerWasHealed()

            if(previous === 1){
                this.addMoveSpeedPenalty(30)
            }
            if(previous === 2){
                this.addMoveSpeedPenalty(10)
            }
        }
    }

    private playerWasHealed(): void{
        this.on_heal_triggers.forEach(elem => {
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
        this.on_status_resist_triggers.forEach(elem => {
            elem.trigger(this, status)
        })
    }

    getTotalArmour(){
        return 0
    }
    
    protected subLife(unit: any = undefined, options = {}): void{

        let value = 1
       
        if(unit && unit.pierce > this.getTotalArmour()){
            value = 2
        }

        if(Func.notChance(100 - this.fragility, this.is_lucky)){
            value *= 2
        }

        this.life_status -= value

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
                this.life_status = 1
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

    playerLoseLife(){
        this.when_lose_life_triggers.forEach(elem => {
            elem.trigger(this)
        })
    }
    
    protected playerWasHited(unit: Unit | undefined): void{
        this.when_hited_triggers.forEach(elem => {
            elem.trigger(this, unit)
        })

        this.sayPhrase()
    }

    public playerTakeLethalDamage(): void{
        this.player_take_lethal_damage_triggers.forEach(elem => {
            elem.trigger(this)
        })
    }

    public playerDead(): void{
        this.player_dead_triggers.forEach(elem => {
            elem.trigger(this)
        })
    }

    public reachNearDead(): void{
        this.reach_near_dead_triggers.forEach(elem => {
            elem.trigger(this)
        })
    }

    public succesefulKill(): void{
        this.on_kill_triggers.forEach(elem => {
            elem.trigger(this)
        })
    }

    public succesefulHit(target = undefined): void{
        this.on_hit_triggers.forEach(elem => {
            elem.trigger(this, target)
        })
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
                    case 'agility':
                        this.agility = stat_value
                        break;
                    case 'speed':
                        this.speed = stat_value
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

    protected damagedAct(): void{
        
    }
    
    protected dyingAct(): void{
        
    }

    public setDyingState(): void{
        this.can_move_by_player = false

        if(this.freezed){
            this.state = 'freezed_dying'
            this.level.addSound({
                name: 'shatter',
                x: this.x,
                y: this.y
            })
        }
        else if(this.exploded){
            this.state = 'explode'
        }
        else{
            this.state = 'dying'    
            this.setTimerToGetState(1500)
        }
        this.stateAct = this.dyingAct
    }

    protected setDeadState(): void{
        this.state = 'dead'
        this.stateAct = this.deadAct
    }

    protected deadAct(): void{

    }

    protected setDamagedAct(): void{
        this.damaged = true
        this.state = 'damaged'
        this.can_move_by_player = false
        this.can_move = false

        this.stateAct = this.damagedAct

        this.cancelAct = () => {
            this.can_move_by_player = true
            this.damaged = false
            this.can_move = true
        }

        this.setTimerToGetState(300)
    }

    public setTarget(id: string): void{
        if(!this.target){
            this.target = id
        }
    }   

    protected reaA(): void{
        if(this.a <= 0.2) return

        this.a -= 0.03
    }

    protected incA(): void{
        if(this.a >= 1) return

        this.a += 0.03
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
        return this.can_move && !this.freezed && !this.zaped
    }

    private directMove(): void{
        if(this.canMove()){
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

        let a: number = this.direct_angle_to_move
        
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

    private moveAct(): void{
        if(this.direct_angle_to_move){
            this.directMove()
            return
        }
        if(this.moveIsPressed() && this.canMove()){
            this.is_moving = true
            if(this.state === 'idle'){
                this.state = 'move'
            }
        }
        else if(!this.moveIsPressed() || !this.canMove()){
            this.reaA()
            this.is_moving = false
            if(this.state === 'move'){
                this.state = 'idle'
            }
            return
        }

        this.incA()

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

    useSecond(){
        if(!this.can_use_skills) return

        let was_used = false
        if(this.third_ability?.canUse()){
            this.third_ability?.use()
            was_used = true
        }
        else if(this.second_ability?.canUse()){
            this.second_ability.use()
            was_used = true
        }

        if(was_used){
            this.useNotUtility()  
        }
    }

    private idleAct(): void{
        if(this.pressed.l_click){
            if(this.can_use_skills && this.first_ability?.canUse()){
                this.first_ability?.use()
                this.useNotUtility()
            }
        }
        else if(this.pressed.r_click){
            this.useSecond()
        }
        else if(this.pressed[69] && this.can_use_skills){
            this.useUtility()
        }
    }

    public setDefend(): void{
        this.state = 'defend'
        this.stateAct = this.defendAct

        this.when_start_block_triggers.forEach(elem => elem.trigger(this))

        let reduce = 80
        this.addMoveSpeedPenalty(-reduce)

        this.cancelAct = () => {
            this.addMoveSpeedPenalty(reduce)
        }
    }

    public defendAct(): void{
        if(!this.pressed[32]){
            this.getState()
        }
    }

    setZapedAct(){     
        

        this.state = 'zaped'     
        this.zaped = true
        this.stateAct = this.zapedAct
        this.can_move_by_player = false

        this.cancelAct = () => {
            this.zaped = false
            this.can_move_by_player = true
        }
    }

    getCdRedaction(){
        return this.cd_reduction
    }

    setFreezeState(){
        this.freezed = true
        this.state = 'freezed'
        this.can_move_by_player = false     

        this.stateAct = this.freezedAct

        this.cancelAct = () => {
            if(!this.is_dead){
                this.freezed = false
                this.can_move_by_player = true
            }
        }
    }

    public act(time: number): void {
        this.time = time
        if(!this.can_act || !this.stateAct) return
        
        if(this.can_block && this.can_move_by_player && this.pressed[32]){
            this.setState(this.setDefend)
        }
       
        this.stateAct(time)
        this.moveAct()
        this.regen()

        if(this.action_impact && time >= this.action_impact){
            if(!this.action){
                this.action = true
            }
            else{
                this.action = false
                this.action_impact = 0
            }
        }
        if(this.action_end && time >= this.action_end){
            if(!this.action_is_end){
                this.action_is_end = true
            }
            else{
                this.action_is_end = false
                this.action_end = 0
            }
        }
    }

    private setIdleState(): void {
        this.state = 'idle'
        this.stateAct = this.idleAct
    }

    public getState(): void {
        if(this.is_dead){
            return
        }
        else{
            this.setState(this.setIdleState)
        }
    }

    public setLastInputs(pressed: object): void{
        if(!this.can_move_by_player){
            this.pressed = {}
            return
        }
        this.pressed = pressed
    }

    public emitStatusEnd(name: string): void{
        this.level.socket.to(this.id).emit('status_end', name)
    }
}