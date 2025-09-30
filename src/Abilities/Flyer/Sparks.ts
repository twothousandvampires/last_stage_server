import { Spark } from "../../Objects/Projectiles/Spark";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import FlyerAbility from "./FlyerAbility";

export default class Sparks extends FlyerAbility{

    cost: number
    pierce: number = 1
    ttl: number = 3000
  
    constructor(owner: Flyer){
        super(owner)
        this.cost = 8
        this.name = 'sparks'
    }

    canUse(){
        return this.owner.resource >= this.cost && !this.owner.is_attacking
    }

    use(){        
        this.owner.pay_to_cost = this.cost

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
            this.hit = true
           
            let count = 10 + this.getAdditionalRadius()
            let zones = 6.28 / count
    
            for(let i = 1; i <= count; i++){
                let min_a = (i - 1) * zones
                let max_a = i * zones
    
                let angle = Math.random() * (max_a - min_a) + min_a

                let proj = new Spark(this.level, this.pierce, this.ttl)
                
                proj.setStart(this.level.time)
                proj.setAngle(angle)
                proj.setPoint(this.x, this.y)
                proj.setOwner(this)
    
                this.level.projectiles.push(proj)
            }

            this.payCost()
        } 
         else if(this.action_is_end){
            this.action_is_end = false
            this.getState()
        }
    }
}