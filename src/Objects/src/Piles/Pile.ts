import Func from "../../../Func";
import Level from "../../../Level";
import { Enemy } from "../Enemy/Enemy";

export default class Pile extends Enemy{

    last_cast_time: number
    frequency: number
    duration: number
    created: number
    cast_time: number

    constructor(level: Level){
        super(level)
        this.name = 'pile'
        this.box_r = 2
        this.move_speed = 0
        this.spawn_time = 1000
        this.last_cast_time = 0
        this.life_status = 4
        this.frequency = 2000
        this.duration = 10000
        this.cast_time = 2000
        this.created = Date.now()
    }

    setStun(){
        // immune
    }

    setZap(){
        // immune
    }

    setFreeze(){
         // immune
    }

    setDyingAct(){
        this.is_dead = true
        this.state = 'dying'
    
        this.stateAct = this.DyingAct
        this.setTimerToGetState(this.dying_time)
        this.level.addSound('skullpile', this.x, this.y)
    }

    takeDamage(unit: any = undefined, options: any = {}){
        if(this.is_dead) return
        
        if(options?.instant_death){
            unit?.succesefulKill(this)
            this.is_dead = true
            this.setDyingAct()
            return
        }

        let damage_value = 1
        
        if(options?.damage_value){
            damage_value = options.damage_value
        }
        
        if(unit && unit?.critical && Func.chance(unit.critical)){
            damage_value *= 2
        }

        if(Func.chance(this.fragility)){
            damage_value *= 2
        }

        this.life_status -= damage_value
        
        unit?.succesefulHit(this)

        if(this.life_status <= 0){
            this.is_dead = true
            this.create_grace_chance += unit?.additional_chance_grace_create ? unit?.additional_chance_grace_create : 0
            unit?.succesefulKill(this)
            this.setDyingAct()
        }
    }

    setCastState(){
        this.state = 'cast'
        this.is_attacking = true
        this.stateAct = this.castAct
        this.action_time = this.cast_time
        this.setImpactTime(95)

        this.cancelAct = () => {
            this.action = false
            this.is_attacking = false
            this.hit = false
        }

        this.setTimerToGetState(this.cast_time)
    }

    idleAct(time: number){
       let last_cast = this.last_cast_time
       
       if(time - this.created >= this.duration){
            this.setDyingAct()
       }
       else if(time - last_cast >= this.frequency){
            this.last_cast_time = time
            this.setCastState()
        }     
    }
}