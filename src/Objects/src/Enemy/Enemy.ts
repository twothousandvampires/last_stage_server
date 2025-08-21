import Func from "../../../Func";
import Level from "../../../Level";
import Armour from "../../Effects/Armour";
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
    create_grace_chance: number
    create_energy_chance: number
    create_entity_chance: number
    create_intervention_chance: number
    create_chance: number
  
    constructor(level: Level){
        super(level)
        this.is_spawning = true
        this.name = 'enemy'
        this.can_check_player = true
        this.is_corpse = false
        this.dying_time = 1200
        this.spawn_time = 1200
        this.create_grace_chance = 18
        this.create_energy_chance = 5
        this.create_entity_chance = 5
        this.create_intervention_chance = 2
        this.create_chance = 15
    }

    getTotalWeights(){
        return [
            ['grace', this.create_grace_chance],
            ['energy', this.create_energy_chance],
            ['entity', this.create_entity_chance],
            ['intervention', this.create_intervention_chance]
        ]
    }

    act(time: number){
        if(!this.can_act || !this.stateAct) return
    
        this.stateAct(time)
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
    
    takeDamage(unit: any = undefined, options: any = {}){
        if(this.is_dead) return
        
        if(options?.instant_death){
            unit?.succesefulKill()
            this.is_dead = true
            this.setDyingAct()
            return
        }

        if(this.checkArmour(unit)){

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

        let damage_value = 1

        if(options?.damage_value){
           damage_value = options.damage_value
        }
       
        if(unit?.critical && Func.chance(unit.critical)){
            damage_value *= 2
        }

        if(Func.chance(this.fragility)){
            damage_value *= 2
        }

        this.life_status -= damage_value

        if(this.life_status <= 0){
           
            if(options?.explode){
                this.dead_type = 'explode'
                this.is_corpse = true
                this.level.addSoundObject(this.getExplodedSound())
            }
            else if(options?.burn){
                this.dead_type = 'burn_dying'
                this.is_corpse = true
            }
            
            this.is_dead = true
            this.create_grace_chance += unit?.additional_chance_grace_create ? unit?.additional_chance_grace_create : 0
            unit?.succesefulKill()
            this.setDyingAct()
        }
        else{
            unit?.succesefulHit()
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

    setAttackState(){
            this.state = 'attack'
            this.is_attacking = true
            this.stateAct = this.attackAct
            this.action_time = this.attack_speed
    
            this.cancelAct = () => {
                this.action = false
                this.hit = false
                this.is_attacking = false
            }

            this.setTimerToGetState(this.attack_speed)
        }
    
}