import Func from "../../Func";
import { FireballProjectile } from "../../Objects/Projectiles/FireballProjectile";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import FlyerAbility from "./FlyerAbility";

export default class Fireball extends FlyerAbility{
    cost: number
    body_melting: boolean
    ignite: boolean

    constructor(owner: Flyer){
        super(owner)
        this.cost = 1
        this.name = 'fireball'
        this.body_melting = false
        this.ignite = false
    }

    canUse(){
        return this.owner.resource >= this.cost
    }

    use(){
        if(this.owner.is_attacking) return

        // this.owner.pay_to_cost = this.cost

        let rel_x =  Math.round(this.owner.pressed.canvas_x + this.owner.x - 40)
        let rel_y =  Math.round(this.owner.pressed.canvas_y + this.owner.y - 40)
        
        if(rel_x < this.owner.x){
            this.owner.flipped = true
        }
        else{
            this.owner.flipped = false    
        }
        
        if(!this.owner.attack_angle){
            this.owner.attack_angle = Func.angle(this.owner.x, this.owner.y, rel_x, rel_y)
        }

        let v =  this.owner.getMoveSpeedPenaltyValue()      
        this.owner.is_attacking = true
        this.owner.state = 'cast'
        this.owner.addMoveSpeedPenalty(-v)

        this.owner.stateAct = this.act
        let cast_speed = this.owner.getCastSpeed()

        this.owner.action_time = cast_speed
        
        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.addMoveSpeedPenalty(v)

            setTimeout(()=>{
                this.owner.hit = false
                this.owner.is_attacking = false
            },50)
        }
        
        this.owner.setTimerToGetState(cast_speed)
    }

    act(){
        if(this.action && !this.hit){
            this.addCourage()
            // this.payCost()
            this.hit = true
            this.level.addSound('fire cast', this.x, this.y)

            let a = undefined                    
            let target = this.getTarget()
            
            if(target){
                a = Func.angle(this.x, this.y, target.x, target.y)
            }

            let proj = new FireballProjectile(this.level, this.first_ability.body_melting)
            proj.ignite = this.first_ability.ignite
            proj.setOwner(this)
            proj.setAngle(a ? a : this.attack_angle)
            proj.setPoint(this.x, this.y)

            this.level.projectiles.push(proj)
            this.attack_angle = undefined
        }
    }
}