import Func from "../../Func";
import StaticFiledEffect from "../../Objects/Effects/StaticFiled";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import FlyerAbility from "./FlyerAbility";

export default class StaticField extends FlyerAbility{

    cd: boolean
    hand_cuffing: boolean
    collapse: boolean

    constructor(owner: Flyer){
        super(owner)
        this.cd = false
        this.name = 'static field'
        this.hand_cuffing = false
        this.collapse = false
    }

    canUse(){
        return !this.cd
    }

    use(){
        if(this.cd) return

        this.cd = true

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

        setTimeout(() => {
            this.cd = false
        }, 4000)

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
            
            this.hit = true
            this.level.addSound('cast', this.x, this.y)

            let e = new StaticFiledEffect(this.level)
            e.hand_cuffing = this.utility.hand_cuffing
            e.collapse = this.utility.collapse

            e.setPoint(this.c_x, this.c_y)
            this.level.binded_effects.push(e)
            this.attack_angle = undefined
        }
    }
}