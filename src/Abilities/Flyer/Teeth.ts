import Func from "../../Func";
import { Tooth } from "../../Objects/Projectiles/Tooth";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import FlyerAbility from "./FlyerAbility";

export default class Teeth extends FlyerAbility{
    cost: number
    constructor(owner: Flyer){
        super(owner)
        this.cost = 1
        this.name = 'teeth'
        this.cd = 2000
    }

    canUse(){
        return !this.used && this.owner.resource >= this.cost && !this.owner.is_attacking
    }

    impact(){
        this.owner.addCourage()
        this.owner.hit = true
        this.used = true

        this.owner.level.addSound('cast', this.x, this.y)

        let a = undefined                    
        let target = this.owner.getTarget()
        
        if(target){
            a = Func.angle(this.owner.x, this.owner.y, target.x, target.y)
        }

        a = a ? a : this.owner.attack_angle

        let count = 3 + this.owner.getAdditionalRadius()

        if(count > 20){
            count = 20
        }
        
        let zone_per_tooth = 0.2
        
        a -= (Math.round(count / 2) * zone_per_tooth)

        for(let i = 1; i <= count; i++){
            let min_a = a + ((i - 1) * zone_per_tooth)
            let max_a = a + (i * zone_per_tooth)

            let angle = Math.random() * (max_a - min_a) + min_a
            let proj = new Tooth(this.owner.level)
            proj.setAngle(angle)
            proj.setPoint(this.owner.x, this.owner.y)

            this.owner.level.projectiles.push(proj)
        }
    }

    use(){
        if(this.used || this.owner.is_attacking) return

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
        let v = this.owner.getMoveSpeedPenaltyValue()
        this.owner.addMoveSpeedPenalty(-v)

        this.owner.stateAct = this.act
        let cast_speed = this.owner.getCastSpeed()

        this.owner.action_time = cast_speed

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