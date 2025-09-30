import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import SpectralSword from "../../Objects/src/Summons/SpectralSword";
import HeavenWrathStatus from "../../Status/HeavenWrathStatus";
import SwordmanAbility from "./SwordmanAbility";

export default class HeavenWrath extends SwordmanAbility{

    call: boolean = false

    constructor(owner: Swordman){
        super(owner)
        this.name = 'heaven wrath'
        this.cost = 9
    }

    canUse(): boolean {
        return this.owner.resource >= this.cost && !this.owner.is_attacking
    }

    use(){
        if(this.owner.is_attacking) return

        this.owner.is_attacking = true
        this.owner.state = 'cast'

        this.owner.pay_to_cost = this.cost

        let attack_move_speed_penalty = this.owner.getAttackMoveSpeedPenalty()
        this.owner.addMoveSpeedPenalty(-attack_move_speed_penalty)

        this.owner.stateAct = this.act
        let attack_speed = this.owner.cast_speed

        this.owner.action_time = attack_speed
        this.owner.setImpactTime(80)

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.addMoveSpeedPenalty(attack_move_speed_penalty)
            this.owner.hit = false
            this.owner.is_attacking = false
        }
    }

    act(){
        if(this.action && !this.hit){
            this.level.sounds.push({
                name: 'holy cast',
                x: this.x,
                y: this.y
            })

            this.payCost()
            this.hit = true
        
            let s = new HeavenWrathStatus(this.level.time)
            s.setDuration(10000)

            this.level.setStatus(this, s)
        }
        else if(this.action_is_end){
            this.action_is_end = false
            this.getState()
        }
    }
}