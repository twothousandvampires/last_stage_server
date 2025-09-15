import Func from "../../Func";
import { FrostSphereProjectile } from "../../Objects/Projectiles/FrostSphereProjectile";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import FlyerAbility from "./FlyerAbility";

export default class FrostSphere extends FlyerAbility{

    cost: number
    frost_rich: boolean
    reign_of_frost: boolean

    constructor(owner: Flyer){
        super(owner)
        this.cost = 1
        this.name = 'frost sphere'
        this.frost_rich = false
        this.reign_of_frost = false
    }

    canUse(){
        return this.owner.resource >= this.cost && !this.owner.is_attacking
    }

    use(){
        let rel_x =  Math.round(this.owner.pressed.canvas_x + this.owner.x - 40)
        let rel_y =   Math.round(this.owner.pressed.canvas_y + this.owner.y - 40)
        
        if(rel_x < this.owner.x){
            this.owner.flipped = true
        }
        else{
            this.owner.flipped = false    
        }

        if(!this.owner.attack_angle){
            this.owner.attack_angle = Func.angle(this.owner.x, this.owner.y, rel_x, rel_y)
        }

        this.owner.is_attacking = true
        this.owner.state = 'cast'

        let move_speed_reduce = this.owner.getMoveSpeedPenaltyValue()
        this.owner.addMoveSpeedPenalty(-move_speed_reduce)

        this.owner.stateAct = this.act
        let cast_speed = this.owner.getCastSpeed()

        this.owner.action_time = cast_speed
        this.owner.setImpactTime(85)

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.addMoveSpeedPenalty(move_speed_reduce)
            this.owner.hit = false
            this.owner.is_attacking = false
        }
    }

    act(){
        if(this.action && !this.hit){
            this.addCourage()
            this.hit = true
            this.level.addSound('cold cast', this.x, this.y)
            let a = undefined
            
            let target = this.getTarget()
            if(target){
                a = Func.angle(this.x, this.y, target.x, target.y)
            }
            
            this.target = undefined
            let proj = new FrostSphereProjectile(this.level)
            proj.frost_rich = this.frost_rich
            proj.reign_of_frost = this.reign_of_frost
            proj.setOwner(this)
            proj.setAngle(a ? a : this.attack_angle)
            proj.setPoint(this.x, this.y)

            this.level.projectiles.push(proj)
            this.attack_angle = undefined
        }
         else if(this.action_is_end){
            this.action_is_end = false
            this.getState()
        }
    }
}