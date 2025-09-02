import Func from "../../../Func";
import Level from "../../../Level";
import ApathyAura from "../../../Status/ApathyAura";
import Fear from "../../../Status/Fear";
import Madness from "../../../Status/Madness";
import Poison from "../../../Status/Poison";
import Armour from "../../Effects/Armour";
import CureseOfDamnedArea from "../../Effects/CureseOfDamnedArea";
import SkullCloud from "../../Effects/SkullCloud";
import { Enemy } from "../Enemy/Enemy";

export default class Boss extends Enemy{

    apathy_radius: number
    can_cast_fear: boolean
    can_cast_madness: boolean

    constructor(level: Level){
        super(level)
        this.name = 'boss'
        this.box_r = 4
        this.move_speed = 0.05
        this.attack_radius = 6
        this.attack_speed = 1600
        this.life_status = 30
        this.spawn_time = 2200
        this.apathy_radius = 10
        this.getState()
        this.level.setStatus(this, new ApathyAura(this.level.time))
        this.can_cast_fear = true
        this.can_cast_madness = true
        this.phasing = true
    }

    takeDamage(unit: any = undefined, options: any = {}){
            if(this.is_dead) return
            
            // if(options?.instant_death){
            //     unit?.succesefulKill()
            //     this.is_dead = true
            //     this.setDyingAct()
            //     return
            // }
    
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
    
           let damage_value = 1
           
            if(options?.damage_value){
                damage_value = options.damage_value
            }
            
            if(unit && unit?.critical && Func.chance(unit.critical)){
                damage_value *= 2
            }
    
            if(Func.chance(this.fragility)){
                damage_value *= 2
            }
    
            this.life_status -= damage_value
            unit?.succesefulHit(this)
    
            if(this.life_status <= 0){
                this.is_dead = true
                unit?.succesefulKill()
                this.setDyingAct()
            }
    }

    setDyingAct(){
        this.state = 'dying'
        this.is_corpse = true
        this.level.deleted.push(this.id)
        this.stateAct = this.DyingAct
        this.setTimerToGetState(this.dying_time)

        setTimeout(() => {
            this.level.script.end(this.level)
        }, 2000)
    }

    setDeadState(){
        this.state = 'dead'
        this.stateAct = this.deadAct
    }

    getWeaponHitedSound(){
        return  {
            name: 'hit bones',
            x:this.x,
            y:this.y
        }
    }

    moveAct(){
        this.state = 'move'

        let a = Func.angle(this.x, this.y, this.target.x, this.target.y)

        this.moveByAngle(a)
    }

    attackAct(){
        return

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

    async idleAct(){
        
        if(this.can_check_player){
           if(!this.target){
                this.can_check_player = false
            
                let p = this.level.players.filter(elem => !elem.is_dead)

                p.sort((a, b) => {
                    return Func.distance(a, this) - Func.distance(b, this)
                })

                this.target = p[0]
           }
           else{
                if(this.target.is_dead){
                    this.target = undefined
                }
           }
           
           setTimeout(() => {
                this.can_check_player = true
           }, 1000)
        }
       
        if(!this.target){
            return
        } 

        if(this.can_cast_fear || this.can_cast_madness){
            this.can_cast_fear = false
            this.can_cast_madness = false

            if(Func.chance(50)){
                let count = 3
                
                let zones = 6.28 / count
        
                for(let i = 1; i <= count; i++){
                    await Func.sleep(300)
                    
                    let min_a = (i - 1) * zones
                    let max_a = i * zones
        
                    let a = Math.random() * (max_a - min_a) + min_a
                    let d_x = Func.random(7, 25)
                    let d_y = Func.random(7, 25)

                    let x = this.x + d_x * Math.sin(a)
                    let y = this.y + d_y * Math.cos(a)

                    let e = new SkullCloud(this.level)
                    e.setPoint(x, y)
        
                    this.level.effects.push(e)

                    let hit = e.getBoxElipse()
                    hit.r = 10

                    
                    this.level.players.forEach(elem => {
                        if(Func.elipseCollision(hit, elem.getBoxElipse())){
                            let status = new Fear(this.level.time)
                            status.setFearTarget(this)
                            status.setDuration(5000)
                            this.level.setStatus(elem, status)
                        }
                    })

                }   
            }
            else if(Func.chance(30)){
                let posible = this.level.players.filter(elem => !elem.is_dead)

                let target = posible[Math.floor(Math.random() * posible.length)]

                if(target){
                    let status = new Madness(this.level.time)
                    status.setDuration(5000)

                    this.level.setStatus(target, status)
                }
            }

            setTimeout(() => {
                this.can_cast_fear = true
                this.can_cast_madness = true
            }, 10000);
        }

        this.moveAct() 
    }
}