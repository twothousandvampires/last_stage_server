import BigFrostNova from "../../Objects/Effects/BigFrostNova";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import FlyerAbility from "./FlyerAbility";

export default class Frostnova extends FlyerAbility{

    cost: number
    ice_genesis: boolean
    cold_spires: boolean
   
    constructor(owner: Flyer){
        super(owner)
        this.cost = 7
        this.name = 'frost nova'
        this.ice_genesis = false
        this.cold_spires = false
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
            this.payCost()

            this.level.sounds.push({
                name: 'frost nova',
                x: this.x,
                y: this.y
            })

            this.hit = true

            let e = new BigFrostNova(this.level)
            e.spires = this.third_ability.cold_spires
            e.genesis = this.third_ability.ice_genesis
            e.setOwner(this)
            e.setPoint(this.x, this.y)

            this.level.binded_effects.push(e)
        } 
         else if(this.action_is_end){
            this.action_is_end = false
            this.getState()
        }
    }
}