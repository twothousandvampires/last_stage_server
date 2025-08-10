import Ability from "../../Abilities/Ability"
import Builder from "../../Classes/Builder"
import Func from "../../Func"
import item from "../../Items/Item"
import Level from "../../Level"
import WithColdStatus from "../../Status/WithColdStatus"
import WithFireStatus from "../../Status/WithFireStatus"
import WithStormStatus from "../../Status/WithStormStatus"
import Unit from "./Unit"

export default abstract class Character extends Unit{

    pressed: { [key: string]: any, }
    can_move_by_player: boolean
    c_x: number
    c_y: number
    max_resource: number
    resource: number
    exploded: boolean
    first_ab: Ability | undefined
    second_ab: Ability | undefined
    third_ab: Ability | undefined
    utility: Ability | undefined
    item: item | undefined
    time: any
    last_skill_used_time: any
    knowledge: number
    agility: number
    speed: number
    will: number
    durability: number
    might: number
    base_regen_time: number
    grace: number
    mastery: number

    onKillTriggers: any[]
    onHitTriggers: any[]
    useNotUtilityTriggers: any[]
    reachNearDeadTriggers: any[]
    playerDeadTriggers: any[]
    playerTakeLethalDamageTriggers: any[]
    whenHitedTriggers: any[]

    avoid_damaged_state_chance: number 
    can_be_lethaled: boolean
    can_regen_resource: boolean
    spend_grace: boolean
    target: string | undefined
    a: number
    can_be_damaged: boolean
    can_regen_life: boolean
    can_use_skills: boolean
    upgrades: any
    can_generate_upgrades: boolean
    pay_to_cost: number
    time_stopped: boolean
    additional_chance_grace_create: number
    killed_by: any
    blessed: boolean
    pierce: number
    critical: number
    status_resistance: number
    can_attack: boolean
    can_cast: boolean
  
    constructor(level: Level){
        super(level)
        this.pay_to_cost = 0
        this.pressed = {}
        this.box_r = 2.5
        this.can_move_by_player = true
        this.resource = 0
        this.max_resource = 7
        this.knowledge = 0
        this.agility = 0
        this.speed = 0
        this.will = 0
        this.durability = 0
        this.might = 0
        this.can_be_damaged = true
        this.c_x = 0
        this.c_y = 0
        this.exploded = false
        this.a = 0.2
        this.can_be_lethaled = true
        this.base_regen_time = 10000
        this.grace = 1
        this.mastery = 0
        this.avoid_damaged_state_chance = 0

        this.onKillTriggers = []
        this.onHitTriggers = []
        this.useNotUtilityTriggers = []
        this.reachNearDeadTriggers = []
        this.playerDeadTriggers = []
        this.playerTakeLethalDamageTriggers = []
        this.whenHitedTriggers = []
        this.can_regen_resource = true
        this.can_regen_life = true
        this.light_r = 16
        this.can_use_skills = true
        this.upgrades = []
        this.can_generate_upgrades = true
        this.time_stopped = false
        this.additional_chance_grace_create = 0
        this.blessed = false
        this.pierce = 0
        this.critical = 0
        this.status_resistance = 5
        this.can_attack = true
        this.can_cast = true
        this.spend_grace = false

        this.getState()
    }

    abstract startGame(): void
    abstract createAbilities(abilities: any): void

    isStatusResist(){
        return Func.chance(this.status_resistance)
    }

    createItem(item_name: string){
        this.item = Builder.createItem(item_name)
    }
    
    payCost(){
        this.resource -= this.pay_to_cost
        this.pay_to_cost = 0
    }

    statusWasApplied(){
        
    }

    getMoveSpeedReduceWhenUseSkill(){
        return 70
    }
    
    getAllUpgrades(){
        
        return [
                {
                    name: 'with storm (status)',
                    canUse: (character: Character) => {
                        return true
                    },
                    teach: (character: Character) => {
                        let status = new WithStormStatus(character.time, 10000, 0)
                        character.level.setStatus(character, status, true)
                    },
                    cost: 2,
                    desc: 'creates lightning periodically which shocks enemies, upgrade increases frequency and radius of searching enemies'
                },
                {
                    name: 'with fire (status)',
                    canUse: (character: Character) => {
                        return true
                    },
                    teach: (character: Character) => {
                        let status = new WithFireStatus(character.time, 10000, 0)
                        character.level.setStatus(character, status, true)
                    },
                    cost: 2,
                    desc: 'creates flames periodically which burn enemies and players, upgrade increases size of flames and stop damaging players'
                },
                {
                    name: 'with cold (status)',
                    canUse: (character: Character) => {
                        return true
                    },
                    teach: (character: Character) => {
                        let status = new WithColdStatus(character.time, 10000, 0)
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
                        character.addLife(3, true)
                    },
                    cost: 1,
                    desc: 'give a life'
                },
                {
                    name: 'forge item',
                    canUse: (character: Character) => {
                        return character.item?.canBeForged(character)
                    },
                    teach: (character: Character) => {
                        character.item?.forge(character)
                    },
                    cost: 1,
                    desc: 'forge your equip'
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
                    cost: 1,
                    desc: 'bones killed by your have reduced chance to ressurect'
                },
                 {
                    name: 'pressure',
                    canUse: (character: Character) => {
                        return character.pierce < 100
                    },
                    teach: (character: Character) => {
                        character.pierce += 15
                    },
                    cost: 1,
                    desc: 'give a chance to ignore armour'
                },
                {
                    name: 'true hit',
                    canUse: (character: Character) => {
                        return character.critical < 100
                    },
                    teach: (character: Character) => {
                        character.critical += 15
                    },
                    cost: 1,
                    desc: 'give a chance to deal double damage'
                },
                {
                    name: 'armour',
                    canUse: (character: Character) => {
                        return character.armour_rate < 95
                    },
                    teach: (character: Character) => {
                        character.armour_rate += 3
                    },
                    cost: 1,
                    desc: 'adds armour rate'
                },
                {
                    name: 'gamble',
                    canUse: (character: Character) => {
                        return character.grace > 1
                    },
                    teach: (character: Character) => {
                        if(Func.chance(50)){
                            character.grace *= 2
                        }
                        else{
                            character.grace = Math.floor(character.grace / 2)
                        }
                    },
                    cost: 1,
                    desc: 'lose or get grace'
                },
        ]
    }

    takePureDamage(){
        this.subLife()
    }

    removeUpgrades(){
        this.upgrades.length = 0
    }

    upgrade(upgrade_name: string){
        let up = this.upgrades.find(elem => elem.name === upgrade_name)
        up.teach(this)
        this.grace -= up.cost
        this.spend_grace = true

        this.removeUpgrades()
        this.closeUpgrades()
    }

    showUpgrades(){
        this.level.socket.to(this.id).emit('show_upgrades', {
            upgrades: this.upgrades,
            grace: this.grace,
            can_hold: !this.spend_grace
        })
    }

    exitGrace(){
        let portal = this.level.bindedEffects.find(elem => elem.name === 'grace')

        if(portal){
            portal.playerLeave(this)
        }
    }

    updateClientSkill(){
        let data = [{
                type: 'first',
                name: this?.first_ab?.name
            },
            {
                type: 'secondary',
                name: this?.second_ab?.name
            },
            {
                type: 'finisher',
                name: this?.third_ab?.name
            },
            {
                type: 'utility',
                name: this?.utility?.name
            }
        ]
        this.level.socket.to(this.id).emit('update_skill', data)
    }

    holdGrace(){
        this.grace += 3
        this.exitGrace()
    }

    closeUpgrades(){
        this.level.socket.to(this.id).emit('close_upgrades')
    }

    setZone(zone_id: number, x: number, y: number){
        this.zone_id = zone_id
        this.x = x
        this.y = y

        this.level.socket.to(this.id).emit('change_level', this.zone_id)
    }
    addLife(count = 1, ignore_poison = false){
        if(!this.can_regen_life && !ignore_poison) return
        
        for(let i = 0; i < count; i++){
            let previous = this.life_status

            if(previous >= 3){
                return
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

    getWeaponHitedSound(){
        return  {
            name: 'sword hit',
            x:this.x,
            y:this.y
        }
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
                this.addMoveSpeedPenalty(-10)
            }
            else if(this.life_status === 1){
                this.addMoveSpeedPenalty(-30)
                this.reachNearDead()
            }
        }
    }
    playerWasHited(){
        this.whenHitedTriggers.forEach(elem => {
            elem.trigger(this)
        })
    }

    playerTakeLethalDamage(){
        this.playerTakeLethalDamageTriggers.forEach(elem => {
            elem.trigger(this)
        })
    }

    playerDead(){
        this.playerDeadTriggers.forEach(elem => {
            elem.trigger(this)
        })
    }

    reachNearDead(){
        this.reachNearDeadTriggers.forEach(elem => {
            elem.trigger(this)
        })
    }

    succesefulKill(){
        this.onKillTriggers.forEach(elem => {
            elem.trigger(this)
        })
    }

    succesefulHit(){
        this.onHitTriggers.forEach(elem => {
            elem.trigger(this)
        })
    }

    applyStats(stats: any){
        for(let stat in stats){
            this[stat] = stats[stat]
        }
    }

    damagedAct(){
        
    }
    
    dyingAct(){
        
    }

    setDyingState(){
        this.can_move_by_player = false
        if(this.freezed){
            this.state = 'freezed_dying'
            this.level.sounds.push({
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

    setDeadState(){
        this.state = 'dead'
        this.stateAct = this.deadAct
    }

    deadAct(){

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

    takeDamage(unut: any = undefined, options: any = {}){
        if(this.damaged) return
        
        this.setState(this.setDamagedAct)
    }

    setTarget(id: string){
        if(!this.target){
            this.target = id
        }
    }   

    reaA(){
        if(this.a <= 0.2) return

        this.a -= 0.03
    }

    incA(){
        if(this.a >= 1){
            return
        }

        this.a += 0.03
    }
    getTarget(){
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
    
    canMove(){
        return this.can_move_by_player && !this.freezed && !this.zaped
    }

    private moveAct(){
      
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

        if(this.pressed['w']){
            next_step_y = -1
        }
        if(this.pressed['s']){
            next_step_y = 1
        }
        if(this.pressed['d']){
            next_step_x = 1
        }
        if(this.pressed['a']){
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
    newStatus(status: any){
        this.level.socket.to(this.id).emit('new_status', status)
    }
    updateStatus(){

    }
    private moveIsPressed(): boolean{
        return this.pressed['w'] || this.pressed['s'] || this.pressed['d'] || this.pressed['a']
    }

    private idleAct() {
        if(this.pressed.l_click){
            if(this.can_use_skills && this.first_ab?.canUse()){
                this.useNotUtilityTriggers.forEach(elem => {
                    elem.trigger(this)
                })
                this.first_ab?.use()
                this.last_skill_used_time = this.time
            }
        }
        else if(this.pressed.r_click){
            this.useSecond()
        }
        else if(this.pressed[' ']){
            this.setState(this.setDefend)
        }
        else if(this.pressed['e'] && this.can_use_skills){
            this.useUtility()
        }
    }

    setDefend(){
        this.state = 'defend'
        this.stateAct = this.defendAct
        let reduce = 80
        this.addMoveSpeedPenalty(-reduce)

        this.cancelAct = () => {
            this.addMoveSpeedPenalty(reduce)
        }
    }

    defendAct(){
        if(!this.pressed[' ']){
            this.getState()
        }
    }

    public act(time: number): void {
        this.time = time
        if(!this.can_act || !this.stateAct) return
        
        // console.log(this.z)
        this.stateAct()
        this.moveAct()
        this.regen()
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

    public setLastInputs(pressed: any) {
        this.pressed = pressed
    }
}