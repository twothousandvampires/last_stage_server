import Func from "../../Func";
import { ForkedLightningProjectile } from "../../Objects/Projectiles/ForkedLightningProjectile";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import FlyerAbility from "./FlyerAbility";

export default class ForkedLightning extends FlyerAbility{

    cost: number
    improved_chain_reaction: boolean
    lightning_eye: boolean

    constructor(owner: Flyer){
        super(owner)
        this.cost = 4
        this.name = 'forked lightning'
        this.improved_chain_reaction = false
        this.lightning_eye = false
        this.cd = 3500
    }

    canUse(){
        return this.owner.resource >= this.cost && !this.used
    }

    use(){
        if(this.owner.is_attacking) return
        
        // this.owner.pay_to_cost = this.cost

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

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.addMoveSpeedPenalty(move_speed_reduce)

            setTimeout(()=>{
                this.owner.hit = false
                this.owner.is_attacking = false
            },50)
        }
        
        this.owner.setTimerToGetState(cast_speed)
    }

    act(){
        if(this.action && !this.hit){

            // this.payCost()
            this.addCourage()

            this.hit = true
            this.level.addSound('lightning cast', this.x, this.y)

            let a = undefined
                        
            let target = this.getTarget()
            if(target){
                a = Func.angle(this.x, this.y, target.x, target.y)
            }

            let proj = new ForkedLightningProjectile(this.level)
            proj.improved_chain_reaction = this.improved_chain_reaction
            proj.lightning_eye = this.lightning_eye
            
            proj.setOwner(this)
            proj.setAngle(a ? a : this.attack_angle)
            proj.setPoint(this.x, this.y)

            this.level.projectiles.push(proj)
            this.attack_angle = undefined
            this.afterUseSecond()
        }
    }
}