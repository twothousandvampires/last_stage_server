import Func from "../../Func";
import StaticFiledEffect from "../../Objects/Effects/StaticFiled";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import FlyerAbility from "./FlyerAbility";

export default class StaticField extends FlyerAbility{

    hand_cuffing: boolean
    collapse: boolean

    constructor(owner: Flyer){
        super(owner)
        this.cd = 10000
        this.name = 'static field'
        this.hand_cuffing = false
        this.collapse = false
    }

    canUse(){
        return !this.used
    }

    impact(){
        this.owner.hit = true
        this.used = true
        this.owner.addCourage()

        this.owner.level.addSound('cast', this.owner.x, this.owner.y)

        let e = new StaticFiledEffect(this.owner.level)
        e.hand_cuffing = this.hand_cuffing
        e.collapse = this.collapse

        e.setPoint(this.owner.c_x, this.owner.c_y)
        this.owner.level.binded_effects.push(e)
    }

    use(){
        if(this.used) return
        
        this.owner.using_ability = this

        let rel_x = Math.round(this.owner.pressed.over_x + this.owner.x - 40)
        let rel_y = Math.round(this.owner.pressed.over_y + this.owner.y - 40)

        this.owner.c_x = rel_x
        this.owner.c_y = rel_y  
        
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
        let v = this.owner.getMoveSpeedPenaltyValue()
        this.owner.addMoveSpeedPenalty(-v)

        this.owner.stateAct = this.act
        let cast_speed = this.owner.getCastSpeed()

        this.owner.action_time = cast_speed
        this.owner.setImpactTime(85)

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.addMoveSpeedPenalty(v)
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