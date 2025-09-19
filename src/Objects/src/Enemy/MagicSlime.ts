import Func from "../../../Func";
import Level from "../../../Level";
import MentalCorrosion from "../../../Status/MentalCorrosion";
import PuddleOfStream from "../../Effects/PuddleOfStream";
import { EnemyLightning } from "../../Projectiles/EnemyLightning";
import { Enemy } from "./Enemy";

export default class MagicSlime extends Enemy{

    weapon_angle: number
    retreat_angle: number | undefined = undefined
    retreat_distance: number = 8
    attack_cd: number = 4000

    constructor(level: Level){
        
        super(level)
        this.name = 'magic slime'
        this.box_r = 3
        this.move_speed = 0.15
        this.attack_radius = 6
        this.attack_speed = 1800
        this.spawn_time = 1400
        this.say_z = 8
        this.weapon_angle = 0.8
        this.life_status = 2
        this.create_chance = 25
        this.player_check_radius = 25
        this.create_item_chance = 3
        this.getState()
    }

    setDeadState(){
        this.is_corpse = true
        this.state = 'dead'
        this.stateAct = this.deadAct
    }

    setDyingAct(){
        if(this.freezed){
            this.state = 'freeze_dying'
            this.is_corpse = true
            this.level.sounds.push({
                name: 'shatter',
                x: this.x,
                y: this.y
            })
        }
        else{
            this.state = this.dead_type ? this.dead_type : 'dying'
        }

        if(!this.freezed && this.dead_type != 'burn_dying'){
            let e = new PuddleOfStream(this.level)
            e.setPoint(this.x, this.y)

            this.level.binded_effects.push(e)
        }

        this.stateAct = this.DyingAct
        this.setTimerToGetState(this.dying_time)
    }

    moveAct(){
        this.state = 'move'

        let a = Func.angle(this.x, this.y, this.target.x, this.target.y)

        this.moveByAngle(a)
    }

    takeDamage(unit?: any, options?: any): void {
        super.takeDamage(unit, options)

        if(unit && Func.distance(this, unit) < 10 && Func.chance(50)){
            let s = new MentalCorrosion(this.level.time)
            s.setDuration(5000)
            this.level.setStatus(unit, s)
        }
    }

    attackAct(){
        if(this.action && !this.hit){
            this.hit = true
                
            let l = new EnemyLightning(this.level)
            l.setPoint(this.x, this.y)

            l.setAngle(Func.angle(this.x, this.y, this.target.x, this.target.y))
            l.setOwner(this)
      
            this.level.projectiles.push(l)
        }
    }

     getWeaponHitedSound(){
        return  {
            name: 'goo',
            x:this.x,
            y:this.y
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
            setTimeout(() => {
                this.is_attacking = false
            }, this.attack_cd)
            this.attack_angle = undefined
        }

        this.setTimerToGetState(this.attack_speed)
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

    idleAct(tick){
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

        if(Func.distance(this, this.target) <= 8 && Func.chance(70)){
            this.setState(this.setRetreatState)
        }

        else if(this.enemyCanAtack(tick) && Func.distance(this, this.target) <= this.player_check_radius){
            this.setState(this.setAttackState)
        }
    }
}