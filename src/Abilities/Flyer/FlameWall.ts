import Func from "../../Func";
import { FlameWallObject } from "../../Objects/Projectiles/FlameWallObject";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import FlyerAbility from "./FlyerAbility";

export default class FlameWall extends FlyerAbility{

    cost: number
    scorching: boolean
    frendly_flame: boolean

    constructor(owner: Flyer){
        super(owner)
        this.cost = 4
        this.scorching = false
        this.frendly_flame = false
        this.name = 'flamewall'
        this.cd = 4000
    }

    canUse(){
        return this.owner.resource >= this.cost && !this.used && !this.owner.is_attacking
    }

    impact(){
        this.owner.addCourage()
        this.owner.hit = true
        this.used = true

        this.owner.level.addSound('fire massive', this.owner.x, this.owner.y)
        let angles = [0, 0.79, 1.57, 2.36, 3.14, 3.93, 4.71, 5.5]
        
        angles.forEach(a => {
            let l = 1 - Math.abs(0.5 * Math.cos(a))

            let n_x = Math.sin(a) * l * 18
            let n_y = Math.cos(a) * l * 18

            let flame = new FlameWallObject(this.owner.level, this.scorching ? 500 : 1000, 9000)
            flame.frendly_flame = this.frendly_flame
            
            flame.setOwner(this.owner)
            flame.setPoint(this.owner.x + n_x, this.owner.y + n_y)
            this.owner.level.projectiles.push(flame)
        })
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
        let v =  this.owner.getMoveSpeedPenaltyValue()  
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