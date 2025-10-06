import Func from "../../../Func";
import Level from "../../../Level";
import MentalCorrosion from "../../../Status/MentalCorrosion";
import PuddleOfStream from "../../Effects/PuddleOfStream";
import { EnemyLightning } from "../../Projectiles/EnemyLightning";
import Enemy from "./Enemy";

export default class MagicSlime extends Enemy {

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
        this.create_item_chance = 1
        this.create_sorcerers_skull_chance = 10
    }

    afterDead(){
        let e = new PuddleOfStream(this.level)
        e.setPoint(this.x, this.y)

        this.level.binded_effects.push(e)
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
        if(this.action && !this.hit && this.target){
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

    idleAct(tick: number){
        this.checkPlayer()
        
        if(!this.target){
            return
        } 

        if(Func.distance(this, this.target) <= 12 && Func.chance(70)){
            this.setState(this.setIdleAct)
        }

        else if(Func.distance(this, this.target) <= 8 && Func.chance(50)){
            this.setState(this.setRetreatState)
        }

        else if(this.enemyCanAtack(tick) && Func.distance(this, this.target) <= this.player_check_radius){
            this.setState(this.setAttackState)
        }
    }
}