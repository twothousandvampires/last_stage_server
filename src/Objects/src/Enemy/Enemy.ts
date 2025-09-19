import Func from "../../../Func";
import Level from "../../../Level";
import Armour from "../../Effects/Armour";
import SmallTextLanguage2 from "../../Effects/SmallTextLanguage2";
import Character from "../Character";
import Unit from "../Unit";

export abstract class Enemy extends Unit{

    is_spawning: boolean
    target: Character | undefined
    check_timer: any
    player_check_radius = 40
    can_check_player: boolean
    is_corpse: boolean
    dying_time: number
    spawn_time: number
    dead_type: string | undefined

    create_grace_chance: number = 15
    create_energy_chance: number = 5
    create_entity_chance: number = 5
    create_intervention_chance: number = 2
    create_item_chance: number = 0

    create_chance: number = 15

    count_as_killed: boolean
    say_z: number = 12
    gold_revard: number = 1
    can_be_burned: boolean = true
    
  
    constructor(level: Level){
        super(level)
        this.is_spawning = true
        this.count_as_killed = true
        this.name = 'enemy'
        this.can_check_player = true
        this.is_corpse = false
        this.dying_time = 1200
        this.spawn_time = 1200
    }

    getTotalWeights(){
        return [
            ['grace', this.create_grace_chance],
            ['energy', this.create_energy_chance],
            ['entity', this.create_entity_chance],
            ['intervention', this.create_intervention_chance],
            ['item', this.create_item_chance]
        ]
    }

    act(time: number){
        if(!this.can_act || !this.stateAct) return
    
        this.stateAct(time)
       
        if(this.action_impact && time >= this.action_impact){
            if(!this.action){
                this.action = true
            }
            else{
                this.action = false
                this.action_impact = 0
            }
        }
    }

    spawnAct(){
        
    }

    deadAct(){
        
    }

    stunnedAct(){

    }

    setStunAct(){
        this.stunned = true
        this.state = 'stunned'     

        this.stateAct = this.stunnedAct

        this.cancelAct = () => {
            this.stunned = false
        }
    }

    setStun(duration: number){
        this.setState(this.setStunAct)

        this.setTimerToGetState(duration)
    }

    setDyingAct(){
        if(this.freezed){
            this.state = 'freeze_dying'
            this.is_corpse = true
            this.level.sounds.push({
                name: 'shatter',
                x: this.x,
                y: this.y
            })
        }
        else{
            this.state = this.dead_type ? this.dead_type : 'dying'
        }

        this.stateAct = this.DyingAct
        this.setTimerToGetState(this.dying_time)
    }

    setIdleAct(){
        this.state = 'idle'
        this.stateAct = this.idleAct
    }

    setDeadState(){
        this.is_corpse = true
        this.state = 'dead'
        this.stateAct = this.deadAct
    }

    DyingAct(){
       
    }

    getExplodedSound(){
        return {
            name: 'corpse explode',
            x: this.x,
            y: this.y
        }
    }

    toJSON(){
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            state: this.state,
            flipped: this.flipped,
            name: this.name,
            z: this.z,
            action: this.action,
            action_time: this.action_time,
        }
    }
    
    takeDamage(unit: any = undefined, options: any = {}){
        if(this.is_dead) return
        
        let instantly = options?.instant_death

        if(instantly){
            this.life_status = 1
        }

        if(this.checkArmour(unit) && !instantly){
            this.level.addSound({
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

        let damage_value = 1

        if(options?.damage_value){
           damage_value = options.damage_value
        }

        let is_pierce = unit && unit?.pierce > this.armour_rate && Func.chance(unit.pierce - this.armour_rate)

        if(is_pierce){
            damage_value ++
            unit.succesefulPierce(this)
        }
       
        if(unit && unit?.critical && Func.chance(unit.critical)){
            damage_value *= 2
        }

        if(Func.chance(this.fragility)){
            damage_value *= 2
        }

        this.life_status -= damage_value

        if(!instantly){
            unit?.succesefulHit(this)
        }
        
        if(this.life_status <= 0){
            if(options?.explode){
                this.dead_type = 'explode'
                this.is_corpse = true
                this.level.addSound(this.getExplodedSound())
            }
            else if(options?.burn && this.can_be_burned){
                this.dead_type = 'burn_dying'
                this.is_corpse = true
            }
            
            if(!instantly){
                this.level.addSound(this.getWeaponHitedSound())
            }

            this.is_dead = true
            this.create_grace_chance += unit?.additional_chance_grace_create ? unit?.additional_chance_grace_create : 0
            unit?.succesefulKill(this)
            //todo
            if(unit instanceof Character){
                unit?.addGold(this.gold_revard)
            }
            
            this.setDyingAct()
        }
    }

    getWeaponHitedSound(){
        return  {
            name: 'sword hit',
            x:this.x,
            y:this.y
        }
    }

    getState(): void {
        if(this.is_dead){
            this.setState(this.setDeadState)
        }
        else if(this.is_spawning){
            this.action_time = this.spawn_time
            this.setState(this.setSpawsState)
        }
        else{
            this.sayPhrase()
            this.setState(this.setIdleAct)
        }
    }

    setSpawsState(){
        this.state = 'spawn'
        this.stateAct = this.spawnAct

        this.cancelAct = () => {
            this.is_spawning = false
        }

        this.setTimerToGetState(this.spawn_time)
    }

    public sayPhrase(): void{
        if(!Func.chance(1)) return

        let phrase = new SmallTextLanguage2(this.level)
        phrase.z = this.say_z
        phrase.setPoint(this.x, this.y)

        this.level.effects.push(phrase)
    }

    setAttackState(){
            this.state = 'attack'
            this.is_attacking = true
            this.stateAct = this.attackAct
            this.action_time = this.attack_speed
            this.setImpactTime(80)
    
            this.cancelAct = () => {
                this.action = false
                this.hit = false
                this.is_attacking = false
            }

            this.setTimerToGetState(this.attack_speed)
        }
    
}