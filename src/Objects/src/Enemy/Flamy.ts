import Func from "../../../Func";
import Level from "../../../Level";
import { FlamyFireBall } from "../../Projectiles/FlamyFireBall";
import { Enemy } from "./Enemy";

export class Flamy extends Enemy{
    retreat_distance: number
    retreat_angle: number | undefined

    constructor(level: Level){
        super(level)
        this.name = 'flamy'
        this.box_r = 2
        this.move_speed = 0.4
        this.attack_radius = 5
        this.attack_speed = 3000
        this.retreat_distance = 10
        this.retreat_angle = undefined
        this.spawn_time = 1400
        this.getState()
    }

    idleAct(){
        if(this.can_check_player){

            if(!this.target){
                this.can_check_player = false
            
                let p = this.level.players.filter(elem => Func.distance(this, elem) <= this.player_check_radius && !elem.is_dead)
                p.sort((a, b) => {
                    return Func.distance(a, this) - Func.distance(b, this)
                })
                this.target = p[0]
            }
            else{
                if(Func.distance(this, this.target) >= this.player_check_radius || this.target.is_dead){
                    this.target = undefined
                }
            }
            
            setTimeout(() => {
                this.can_check_player = true
            }, 2000)

        }
        
        if(!this.target){
            return
        } 


        if(Func.distance(this, this.target) <= this.retreat_distance && Math.random() > 0.5){
            this.setState(this.setRetreatState)
        }
        else{
            this.setState(this.setAttackState)
        }

    }

    retreatAct(){
        let a = this.retreat_angle

        if(!a) return
        
        this.moveByAngle(a)
    }

    setRetreatState(){
        this.state = 'move'
        this.retreat_angle = Func.angle(this.target?.x, this.target.y,this.x, this.y)
        this.retreat_angle += Math.random() * 1.57 * (Func.random(50) ? -1 : 1)

        this.stateAct = this.retreatAct

        this.cancelAct = () => {
            this.retreat_angle = undefined
        }

        this.setTimerToGetState(2000)
    }
    
    attackAct(){
        if(this.action && !this.hit){
            this.hit = true
    
            let fb = new FlamyFireBall(this.level, this.x, this.y)

            fb.setAngle(Func.angle(this.x, this.y, this.target.x, this.target.y))
            fb.setOwner(this)
            fb.setPoint(this.x, this.y)

            this.level.projectiles.push(fb)
        }
    }
}