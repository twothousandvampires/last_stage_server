import Func from "../../../Func";
import Level from "../../../Level";
import Bleed from "../../../Status/Bleed";
import { Enemy } from "./Enemy";

export default class Impy extends Enemy{

    weapon_angle: number

    constructor(level: Level){
        super(level)
        this.name = 'impy'
        this.box_r = 2
        this.move_speed = 0.26
        this.attack_radius = 4.5
        this.attack_speed = 1450
        this.spawn_time = 1000
        this.say_z = 8
        this.weapon_angle = 0.7
        this.getState()
    }

    moveAct(){
        this.state = 'move'

        let a = Func.angle(this.x, this.y, this.target.x, this.target.y)

        this.moveByAngle(a)
    }

    attackAct(){
        if(this.action && !this.hit){
            this.hit = true
    
            let e = this.getBoxElipse()
            e.r = this.attack_radius

            if(this.target?.z < 5 && Func.elipseCollision(e, this.target?.getBoxElipse()) && Func.checkAngle(this, this.target, this.attack_angle, this.weapon_angle)){
                this.target?.takeDamage(this)
                if(Func.chance(5)){
                    let status = new Bleed(this.level.time)
                    status.setDuration(4000)
                    this.level.setStatus(this.target, status)
                }
            }
        }
    }

    setAttackState(){
        this.state = 'attack'
        this.is_attacking = true
        this.stateAct = this.attackAct
        this.action_time = this.attack_speed
        this.setImpactTime(80)
        
        this.attack_angle = Func.angle(this.x, this.y, this.target?.x, this.target.y)

        this.cancelAct = () => {
            this.action = false
            this.hit = false
            this.is_attacking = false
            this.attack_angle = undefined
        }

        this.setTimerToGetState(this.attack_speed)
    }

    idleAct(){
        if(this.can_check_player){
           if(!this.target){
                this.can_check_player = false
            
                let p = this.level.players.filter(elem => Func.distance(this, elem) <= this.player_check_radius && !elem.is_dead && elem.z < 5)

                p.sort((a, b) => {
                    return Func.distance(a, this) - Func.distance(b, this)
                })

                this.target = p[0]
           }
           else{
                if(Func.distance(this, this.target) > this.player_check_radius || this.target.is_dead){
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

        let a_e = this.getBoxElipse()
        a_e.r = this.attack_radius

        if(Func.elipseCollision(a_e, this.target.getBoxElipse())){

            if(Func.chance(30)){
                this.level.sounds.push({
                    x: this.x,
                    y: this.y,
                    name: 'impy'
                })
            }
           
            this.setState(this.setAttackState)
        }
        else{
            this.moveAct()
        }
    }
}