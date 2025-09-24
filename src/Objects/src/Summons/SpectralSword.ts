import Func from "../../../Func";
import Level from "../../../Level";
import Character from "../Character";
import { Enemy } from "../Enemy/Enemy";

export default class SpectralSword extends Enemy{

    weapon_angle: number
    target: any
    created: number = Date.now()

    constructor(level: Level, private ttl: number = 12000, creator: Character){
        super(level)
        this.name = 'spectral sword'
        this.box_r = 2
        this.move_speed = 0.25
        this.attack_radius = 6.5
        this.attack_speed = creator.getAttackSpeed()
        this.spawn_time = 1000
        this.say_z = 8
        this.weapon_angle = 0.9
        this.create_chance = 2
        this.count_as_killed = false
        this.phasing = true
        this.player_check_radius = 25
        this.life_status = creator.life_status

        this.getState()
    }

    attackAct(){
        if(this.action && !this.hit){
            this.hit = true
    
            let e = this.getBoxElipse()
            e.r = this.attack_radius

            if(this.target?.z < 5 && Func.elipseCollision(e, this.target?.getBoxElipse()) && Func.checkAngle(this, this.target, this.attack_angle, this.weapon_angle)){
                this.target?.takeDamage(undefined)
            }
        }
    }

    setAttackState(){
        this.state = 'attack'
        this.is_attacking = true
        this.stateAct = this.attackAct
        this.action_time = this.attack_speed

        this.attack_angle = Func.angle(this.x, this.y, this.target?.x, this.target.y)
        this.setImpactTime(85)

        this.cancelAct = () => {
            this.action = false
            this.hit = false
            this.is_attacking = false
            this.attack_angle = undefined
        }

        this.setTimerToGetState(this.attack_speed)
    }

    idleAct(tick: number){

        if(tick - this.created >= this.ttl){
            this.is_dead = true
            this.setDyingAct()
            return
        }

        if(this.can_check_player){
           if(!this.target){
                this.can_check_player = false
            
                let p = this.level.enemies.filter(elem => !(elem instanceof SpectralSword) && Func.distance(this, elem) <= this.player_check_radius && !elem.is_dead && elem.z < 5)

                if(p.length){
                    this.target = p[Math.floor(Math.random() * p.length)]
                }
                else{
                    this.target = undefined
                }  
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

    setStun(){
        // immune
    }

    setZap(){
        // immune
    }

    setFreeze(){
         // immune
    }
}