import Func from "../../../Func";
import Level from "../../../Level";
import { FlamyFireBall } from "../../Projectiles/FlamyFireBall";
import { Enemy } from "./Enemy";

export class Flamy extends Enemy {

    cooldown_attack: number = 4000

    constructor(level: Level){
        super(level)
        this.name = 'flamy'
        this.box_r = 2
        this.move_speed = 0.3
        this.attack_radius = 5
        this.attack_speed = 2000
        this.retreat_distance = 8
        this.spawn_time = 1400
        this.player_check_radius = 25
        this.say_z = 8
    }

    idleAct(tick: number){
        this.checkPlayer()
        
        if(!this.target){
            return
        } 

        if(Func.distance(this, this.target) <= 12 && Func.chance(70)){
            this.setState(this.setIdleAct)
        }
        else if(Func.distance(this, this.target) <= this.retreat_distance && Func.chance(50)){
            this.setState(this.setRetreatState)
        }
        else if(this.enemyCanAtack(tick)){
            this.setState(this.setAttackState)
        }
    }

    attackAct(){
        if(this.action && !this.hit && this.target){
            this.hit = true
    
            let fb = new FlamyFireBall(this.level)
            fb.setPoint(this.x, this.y)

            fb.setAngle(Func.angle(this.x, this.y, this.target.x, this.target.y))
            fb.setOwner(this)
            fb.setPoint(this.x, this.y)

            this.level.projectiles.push(fb)
        }
    }
}