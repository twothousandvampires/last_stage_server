import Func from "../../../Func";
import Level from "../../../Level";
import Poison from "../../../Status/Poison";
import { Enemy } from "./Enemy";
import Skull from "./Skull";

export default class Bones extends Enemy{

    ressurect_chance: number

    constructor(level: Level){
        super(level)
        this.name = 'bones'
        this.box_r = 2.2
        this.move_speed = 0.15
        this.attack_radius = 5
        this.attack_speed = 1500
        this.cooldown_attack = 2200
        this.life_status = 1
        this.spawn_time = 1600
        this.ressurect_chance = 60
        this.armour_rate = 10
        this.gold_revard = 1
        this.weapon_angle = 0.8
    }

    takeDamage(unit: any = undefined, options: any = {}){
        super.takeDamage(unit, options)

        if(this.life_status <= 0 && unit?.blessed){
            this.ressurect_chance = Math.round(this.ressurect_chance / 2)
        }
    }

    setDeadState(){
        if(Func.notChance(this.ressurect_chance)){
            this.is_corpse = true
            this.state = 'dead'
            this.stateAct = this.deadAct
            let skull = new Skull(this.level)
            skull.setPoint(this.x, this.y)

            this.level.enemies.push(skull)
        }
        else{
            this.state = 'dead_with_skull'
            this.stateAct = this.deadAct
            this.ressurect_chance -= 10
            setTimeout(() => {
                this.setState(this.setResurectAct)
            }, 3000)
        }
    }

    getWeaponHitedSound(){
        return  {
            name: 'hit bones',
            x:this.x,
            y:this.y
        }
    }

    ressurectAct(){

    }

    setResurectAct(){
        this.state = 'ressurect'
        this.stateAct = this.ressurectAct

        setTimeout(() => {
            this.is_dead = false
            this.getState()
        }, 1500)
    }

    getExplodedSound(){
        return {
            name: 'bones explode',
            x: this.x,
            y: this.y
        }
    }

    attackAct(){
        if(this.action && !this.hit && this.target && this.attack_angle){
            this.hit = true
            
            this.level.sounds.push({
                x: this.x,
                y: this.y,
                name: 'short sword swing'
            })

            let e = this.getBoxElipse()
            e.r = this.attack_radius

            if(this.target?.z < 5 && Func.elipseCollision(e, this.target?.getBoxElipse()) && Func.checkAngle(this, this.target, this.attack_angle, this.weapon_angle)){
                this.target.takeDamage(this, {})
                if(Func.chance(25)){
                    let status = new Poison(Date.now())
                    status.setDuration(6000)
                    this.level.setStatus(this.target, status)
                }
            }
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