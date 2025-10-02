import Func from "../../Func"
import Level from "../../Level"
import GameObject from "./GameObject"

export default abstract class Unit extends GameObject {

    move_speed_penalty: number = 0
    action_impact: number = 0
    action_end_time: number = 0
    action_is_end: boolean = false
       
    exploded: boolean = false
    burned: boolean = false
    
    weapon_angle: number = 0
    is_corpse: boolean = false
    flipped: boolean = false
    is_attacking: boolean = false
    is_moving: boolean = false
    attack_angle: number | undefined = undefined
    attack_radius: number = 0
    state: string = 'none'
    move_angle: number | undefined = undefined
    stateAct: Function | undefined = undefined
    cancelAct: Function | undefined = undefined
    getStateTimer: any
    is_dead: boolean = false
    hit: boolean = false
    action: boolean = false
    attack_speed: number = 2000
    damaged: boolean = false
    action_time: number | undefined
    freezed: boolean = false
    penetrated_rating: number = 0

    life_status: number = 1
    armour_rate: number = 0
    stunned: boolean = false
    shocked: boolean = false
    zaped: boolean = false
  
    fragility: number = 0
    ward: number = 0
    cast_speed: number = 2000
    can_be_damaged: boolean = true
    pierce: number = 0
    
    constructor(level: Level){
        super(level)
    }

    abstract getState(): void
    abstract toJSON(): object
    abstract takeDamage(unit: Unit | undefined, options: object | undefined): void

    isStatusResist(){
        return false
    }

    setImpactTime(c: number){
        if(!this.action_time) return

        c += Func.chance(50) ? 5 : -5
        this.action_impact = this.level.time + (this.action_time * (c / 100))
        this.action_end_time =  this.level.time + this.action_time
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

       let p = 0

       if(unit && unit.pierce){
            p = unit.pierce
       }

       if(p >= this.armour_rate) return false

       let arm = this.armour_rate - p

       if(arm > 95){
          arm = 95
       }

       let check = Func.chance(arm)

       return check
    }

    setZap(duration: number = 100){
        if(this.is_dead) return
        if(!this.can_be_damaged) return

        this.setState(this.setZapedAct)
        this.setTimerToGetState(duration)
    }

    setTimerToGetState(ms: number){
        this.getStateTimer = setTimeout(() => {
            this.getState()
        }, ms)
    }

    getMoveSpeed(): number{
        let total_inc = this.move_speed_penalty
        
        if(!total_inc) return this.move_speed

        if(total_inc > 200) total_inc = 200
        if(total_inc < -95) total_inc = -95
       
        return this.move_speed * (1 + total_inc / 100)
    }

    addMoveSpeedPenalty(value: number){
        this.move_speed_penalty += value
    }

    setState(newState: Function) {
        this.is_moving = false
        if(this.cancelAct){
            this.action_impact = 0
            this.action_end_time = 0
            this.action_is_end = false
            this.cancelAct()

            this.cancelAct = undefined
        }

        if(this.getStateTimer){
            clearTimeout(this.getStateTimer)
            this.getStateTimer = undefined
        }

        newState.apply(this)
        this.wasChanged()
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

        if(!this.phasing){
            for(let i = 0; i < this.level.enemies.length; i++){
                let enemy = this.level.enemies[i]

                if(enemy === this) continue
                if(enemy.phasing) continue
                if(enemy.is_dead) continue
                
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
        }
       
        this.addToPoint(n_x, n_y)
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

    setStun(duration: number){

    }

    stunnedAct(){

    }


    zapedAct(){

    }

    deadAct(){
        
    }

    dyingAct(){
       
    }
}