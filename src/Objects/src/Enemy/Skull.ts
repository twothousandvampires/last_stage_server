import Func from "../../../Func";
import Level from "../../../Level";

import { Enemy } from "./Enemy";

export default class Skull extends Enemy{

    constructor(level: Level){
        super(level)
        this.name = 'skull'
        this.box_r = 0.8
        this.move_speed = 0.2
        this.attack_radius = 1
        this.attack_speed = 1100
        this.is_spawning = false
        this.create_grace_chance = 0
        this.create_entity_chance = 0
        this.create_energy_chance = 0
        this.getState()
    }

    setDyingAct(){
        this.is_corpse = true
        if(this.freezed){
            this.state = 'freeze_dying'
            this.level.sounds.push({
                name: 'shatter',
                x: this.x,
                y: this.y
            })
        }
        else{
            this.state = 'dying'
        }
        this.stateAct = this.DyingAct
        this.setTimerToGetState(this.dying_time)
    }

    moveAct(){
        this.state = 'move'

        let a = Func.angle(this.x, this.y, this.target.x, this.target.y)

        this.moveByAngle(a)
    }

    getExplodedSound(){
        return {
            name: 'bones explode',
            x: this.x,
            y: this.y
        }
    }

    attackAct(){
        if(this.action && !this.hit){
            this.hit = true
    
            let e = this.getBoxElipse()
            e.r = this.attack_radius

            if(this.target?.z < 5 && Func.elipseCollision(e, this.target?.getBoxElipse())){
                this.target?.takeDamage()
            }
        }
    }

    getWeaponHitedSound(){
        return  {
            name: 'hit bones',
            x:this.x,
            y:this.y
        }
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
            this.setState(this.setAttackState)
        }
        else{
            this.moveAct()
        }
    }
}