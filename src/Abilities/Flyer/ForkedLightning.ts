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
        return this.owner.resource >= this.cost && !this.used && !this.owner.is_attacking
    }

    impact(){
        this.owner.addCourage()
        this.owner.hit = true
        this.used = true
        
        this.owner.level.addSound('lightning cast', this.owner.x, this.owner.y)

        let a = undefined
                    
        let target = this.owner.getTarget()

        if(target){
            a = Func.angle(this.owner.x, this.owner.y, target.x, target.y)
        }

        let proj = new ForkedLightningProjectile(this.owner.level)
        proj.improved_chain_reaction = this.improved_chain_reaction
        proj.lightning_eye = this.lightning_eye
        
        proj.setOwner(this.owner)
        if(a){
            proj.setAngle(a)
        }
        else if(this.owner.attack_angle){
            proj.setAngle(this.owner.attack_angle)
        }
       
        proj.setPoint(this.owner.x, this.owner.y)

        this.owner.level.projectiles.push(proj)
        this.owner.attack_angle = undefined
    }

    use(){
        if(this.used) return

        this.owner.using_ability = this

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
            this.afterUse()        
            this.owner.hit = false
            this.owner.is_attacking = false    
        }
    }

    act(){
        if(this.action && !this.hit){
            this.using_ability.impact()
        }
         else if(this.action_is_end){
            this.action_is_end = false
            this.getState()
        }
    }
}