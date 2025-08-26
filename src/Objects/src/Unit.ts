import Func from "../../Func"
import Level from "../../Level"
import GameObject from "./GameObject"

export default abstract class Unit extends GameObject {
    move_speed_penalty: number
   
    flipped: boolean
    is_attacking: boolean
    is_moving: boolean
    attack_angle: number | undefined
    attack_radius: number
    state: string
    move_angle: number | undefined
    stateAct: Function | undefined
    cancelAct: Function | undefined
    getStateTimer: any
    is_dead: boolean
    hit: boolean
    action: boolean
    attack_speed: number // ms
    damaged: boolean
    action_time: number | undefined
    freezed: boolean

    life_status: number
    armour_rate: number
    stunned: boolean
    shocked: boolean
    zaped: boolean
    phasing: boolean
    can_act: boolean
    fragility: number
    
    constructor(level: Level){
        super(level)
        this.move_speed_penalty = 0
        this.fragility = 0
        this.flipped = false
        this.is_attacking = false
        this.is_moving = false
        this.attack_radius = 0
        this.state = 'none'
        this.is_dead = false
        this.hit = false
        this.action = false
        this.attack_speed = 2000
        this.damaged = false
        this.life_status = 1
        this.armour_rate = 0
        this.stunned = false
        this.freezed = false
        this.shocked = false
        this.zaped = false
        this.phasing = false
        this.can_act = true
    }

    abstract getState(): void
    
    isStatusResist(){
        console.log('unit')
        return false
    }

    zapedAct(){

    }

    setZapedAct(){     
        this.state = 'zaped'     
        this.zaped = true
        this.stateAct = this.zapedAct

        this.cancelAct = () => {
            this.zaped = false
        }
    }

    checkArmour(unit: any){
       if(this.armour_rate === 0) return false

       let check = Func.chance(this.armour_rate)

       if(!unit || !unit.pierce){
            return check
       }

        return !Func.chance(unit.pierce)
    }

    setZap(duration: number = 100){
        if(this.is_dead) return

        this.setState(this.setZapedAct)
        this.setTimerToGetState(duration)
    }

    setTimerToGetState(ms: number, callback: any = undefined){
        this.getStateTimer = setTimeout(() => {
            if(callback){
                if(this.cancelAct){
                    this.cancelAct()
                    this.cancelAct = undefined
                }
                callback()
            }
            else{
                this.getState()
            } 
        }, ms)
    }

    setStun(duration: number){

    }

    getMoveSpeed(): number{
        let total_inc = this.move_speed_penalty
        
        if(!total_inc) return this.move_speed
        if(total_inc > 100) total_inc = 100
        if(total_inc < -90) total_inc = -90
       
        return this.move_speed * (1 + total_inc / 100)
    }

    addMoveSpeedPenalty(value: number){
        this.move_speed_penalty += value
    }

    succesefulKill(){
        
    }

    takeDamage(unit: any = undefined, options: any = {}){
        
    }

    setState(newState: Function) {
        this.is_moving = false
        if(this.cancelAct){
            this.cancelAct()
            this.cancelAct = undefined
        }

        if(this.getStateTimer){
            clearTimeout(this.getStateTimer)
            this.getStateTimer = undefined
        }

        newState.apply(this)
    }

    moveByAngle(angle: number){

        let a = angle
        
        let l = 1 - Math.abs(0.5 * Math.cos(a))

        let n_x = Math.sin(a) * l
        let n_y = Math.cos(a) * l
        
        let speed = this.getMoveSpeed()

        n_x *= speed
        n_y *= speed
               
        if(n_x < 0 && !this.is_attacking){
            this.flipped = true
        }
        else if(!this.is_attacking){
            this.flipped = false
        }

        let x_coll = false
        let y_coll = false
        let coll_e_x = undefined
        let coll_e_y = undefined
        
        if(this.isOutOfMap(this.x + n_x, this.y + n_y)){
            return
        }

        for(let i = 0; i < this.level.enemies.length; i++){
            let enemy = this.level.enemies[i]

            if(enemy === this) continue
            if(enemy.phasing) continue

            if(Func.elipseCollision(this.getBoxElipse(n_x, 0), enemy.getBoxElipse())){
                x_coll = true
                n_x = 0
                coll_e_x = enemy
                if(y_coll){
                    break
                }
            }
            if(Func.elipseCollision(this.getBoxElipse(0, n_y), enemy.getBoxElipse())){
                y_coll = true
                n_y = 0
                coll_e_y = enemy
                if(x_coll){
                    break
                }
            }
        }
        
        if(x_coll && n_y === 0){
                if(this.y <= coll_e_x.y){
                    n_y = - 0.4
                }
                else{
                    n_y = 0.4
                }
            }

        if(y_coll && n_x === 0){
            if(this.x <= coll_e_y.x){
                n_x = -0.4
            }
            else{
                n_x = 0.4
            }
        }

        this.addToPoint(n_x, n_y)
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
            light_r: this.light_r,
            can_act: this.can_act
        }
    }

    succesefulHit(){
        
    }

    setFreeze(duration: number){
        if(this.is_dead) return
        
        this.setState(this.setFreezeState)

        this.setTimerToGetState(duration)
    }

    setFreezeState(){
        this.freezed = true
        this.state = 'freezed'     

        this.stateAct = this.freezedAct

        this.cancelAct = () => {
            if(!this.is_dead){
                this.freezed = false
            }
        }
    }

    freezedAct(){

    }
}