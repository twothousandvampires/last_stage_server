import Func from "../../../Func";
import Level from "../../../Level";
import Poison from "../../../Status/Poison";
import Armour from "../../Effects/Armour";
import { Enemy } from "./Enemy";
import Skull from "./Skull";

export default class Bones extends Enemy{

    ressurect_chance: number

    constructor(level: Level){
        super(level)
        this.name = 'bones'
        this.box_r = 2.2
        this.move_speed = 0.15
        this.attack_radius = 6
        this.attack_speed = 1600
        this.life_status = 2
        this.spawn_time = 1600
        this.ressurect_chance = 40
        this.getState()
    }

    takeDamage(unit: any = undefined, options: any = {}){
            if(this.is_dead) return
            
            if(options?.instant_death){
                unit?.succesefulKill()
                this.is_dead = true
                this.setDyingAct()
                return
            }
    
            if(this.checkArmour(unit)){
                this.level.sounds.push({
                    name: 'metal hit',
                    x: this.x,
                    y: this.y
                })
                let e = new Armour(this.level)
                e.setPoint(Func.random(this.x - 2, this.x + 2), this.y)
                e.z = Func.random(2, 8)
                this.level.effects.push(e)
                return
            }
    
           if(options?.damage_value){
                this.life_status -= options.damage_value
            }
            else{
                this.life_status --
            }

            if(unit?.critical && Func.chance(unit.critical)){
                this.life_status --
            }
    
            if(this.life_status <= 0){
                if(unit?.blessed){
                    this.ressurect_chance = Math.round(this.ressurect_chance / 2)
                }
                if(options?.explode){
                    this.dead_type = 'explode'
                    this.is_corpse = true
                    this.level.addSoundObject(this.getExplodedSound())
                }
                else if(options?.burn){
                    this.dead_type = 'burn_dying'
                    this.is_corpse = true
                }
                
                this.is_dead = true
                this.create_grace_chance += unit?.additional_chance_grace_create ? unit?.additional_chance_grace_create : 0
                unit?.succesefulKill()
                this.setDyingAct()
            }
            else{
                unit?.succesefulHit()
            }
    }

    setDeadState(){
        if(!this.freezed && this.state != 'burn_dying' && !Func.chance(this.ressurect_chance)){
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
            this.level.sounds.push({
                x: this.x,
                y: this.y,
                name: 'short sword swing'
            })
            let e = this.getBoxElipse()
            e.r = this.attack_radius

            if(this.target?.z < 5 && Func.elipseCollision(e, this.target?.getBoxElipse())){
                this.target?.takeDamage()
                if(Func.chance(50)){
                    let status = new Poison(Date.now(), 10000)
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