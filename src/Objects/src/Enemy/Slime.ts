import Func from "../../../Func";
import Distance from "../../../Items/Forgings/Distance";
import Level from "../../../Level";
import Corrosion from "../../../Status/Corrosion";
import PuddleOfPoison from "../../Effects/PuddleOfPoison";
import { FlyingMucus } from "../../Projectiles/FlyingMucus";
import { Enemy } from "./Enemy";

export default class Slime extends Enemy{

    weapon_angle: number
    last_mucus_time: number = 0
    mucus: boolean = false

    constructor(level: Level){
        super(level)
        this.name = 'slime'
        this.box_r = 3
        this.move_speed = 0.2
        this.attack_radius = 6.5
        this.attack_speed = 1800
        this.spawn_time = 1400
        this.say_z = 8
        this.weapon_angle = 1
    }

    setDeadState(){
        this.is_corpse = true
        this.state = 'dead'
        this.stateAct = this.deadAct

    }

    setdyingAct(){
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
            let e = new PuddleOfPoison(this.level)
            e.setPoint(this.x, this.y)

            this.level.binded_effects.push(e)
        }

        this.stateAct = this.dyingAct
        this.setTimerToGetState(this.dying_time)
    }

    attackAct(){
        if(this.action && !this.hit){
            this.hit = true
            if(this.mucus){
                this.mucus = false
                let proj = new FlyingMucus(this.level)
                proj.setAngle(Func.angle(this.x, this.y, this.target.x, this.target.y))
                proj.setPoint(this.x, this.y)
                proj.setOwner(this)

                this.level.projectiles.push(proj)
            }
            else{
                let e = this.getBoxElipse()
                e.r = this.attack_radius

                if(this.target?.z < 5 && Func.elipseCollision(e, this.target?.getBoxElipse()) && Func.checkAngle(this, this.target, this.attack_angle, this.weapon_angle)){
                    this.target?.takeDamage(this)
                    if(Func.chance(50)){
                        let status = new Corrosion(this.level.time)
                        status.setDuration(6000)
                        this.level.setStatus(this.target, status)
                        this.level.addSound('goo', this.x, this.y)
                    }
                }
            }   
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
            this.is_attacking = false
            this.attack_angle = undefined
        }

        this.setTimerToGetState(this.attack_speed)
    }

    idleAct(tick: number){
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

        if(tick - this.last_mucus_time >= 10000 && Func.distance(this, this.target) >= 12){
            this.last_mucus_time = tick
            this.setState(this.setAttackState)
            this.mucus = true
        }
        else if(Func.elipseCollision(a_e, this.target.getBoxElipse())){
            if (this.enemyCanAtack(tick)){
                this.setState(this.setAttackState)
            }
        }
        else{
            this.moveAct()
        }
    }
}