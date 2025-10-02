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
        this.cooldown_attack = 1200
        this.is_spawning = false
        this.create_grace_chance = 0
        this.create_entity_chance = 0
        this.create_energy_chance = 0
        this.gold_revard = 0
        this.create_chance = 0
    }

    getExplodedSound(){
        return {
            name: 'bones explode',
            x: this.x,
            y: this.y
        }
    }

    attackAct(){
        if(this.action && !this.hit && this.target){
            this.hit = true
    
            let e = this.getBoxElipse()
            e.r = this.attack_radius

            if(this.target.z < 5 && Func.elipseCollision(e, this.target?.getBoxElipse())){
                this.target.takeDamage(this, {})
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

    idleAct(tick: number){
        this.checkPlayer()
       
        if(!this.target){
            return
        } 

        let a_e = this.getBoxElipse()
        a_e.r = this.attack_radius

        if(Func.elipseCollision(a_e, this.target.getBoxElipse())){
            if (this.enemyCanAtack(tick)){
                this.setState(this.setAttackState)
            }
            else{
                this.setState(this.setIdleAct)
            }
        }
        else{
            this.moveAct()
        }
    }
}