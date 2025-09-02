import Func from "../../../Func";
import Level from "../../../Level";
import GroundHit from "../../Effects/GroundHit";
import { Enemy } from "./Enemy";

export default class Solid extends Enemy{
    explode: boolean
    hit_x: number
    hit_y: number
    
    constructor(level: Level){
        super(level)
        this.name = 'solid'
        this.box_r = 4
        this.move_speed = 0.15
        this.attack_radius = 7
        this.attack_speed = 1800
        this.explode = false
        this.spawn_time = 1200
        this.getState()
        this.life_status = 4
        this.hit_x = 0
        this.hit_y = 0
        this.armour_rate = 10
        this.create_grace_chance = 50
        this.create_chance = 80
        this.create_chance = 80
        this.say_z = 18
    }

    setDeadState(){
        this.state = 'dead'
        this.stateAct = this.deadAct
    }

    deadAct(){
        if(!this.explode && this.action){
            this.explode = true
            this.action = false
            this.state = 'dead_explode'
            let targets = this.level.enemies.concat(this.level.players)
            targets.forEach((e) => {
                if(e != this && Func.distance(this, e) <= 12){
                    e.takeDamage(undefined, {
                        burn: true
                    })
                }
            })
            setTimeout(()=> {
                this.is_corpse = true
            }, 800)
        }
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
            e.x = this.hit_x
            e.y = this.hit_y
            e.r = 4

            let effect = new GroundHit(this.level)
            effect.setPoint(e.x, e.y)
          
            this.level.effects.push(effect)

            this.level.addSound('ground hit', e.x, e.y)
            this.level.players.forEach(p => {
                if(p?.z < 5 && Func.elipseCollision(e, p?.getBoxElipse())){
                    p.takeDamage()
                }
            })
        }
    }

    setAttackState(){
        this.state = 'attack'
        this.is_attacking = true
        this.stateAct = this.attackAct
        this.action_time = this.attack_speed

        this.hit_x = this.target.x
        this.hit_y = this.target.y
        this.level.addSound('demon roar', this.x, this.y)
        
        this.cancelAct = () => {
            this.action = false
            this.hit = false
            this.is_attacking = false
        }

        this.setTimerToGetState(this.attack_speed)
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
            this.setState(this.setAttackState)
        }
        else{
            this.moveAct()
        }
    }
}