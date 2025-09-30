import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import MetalThornsStatus from "../../Status/MetalThornsStatus";
import SwordmanAbility from "./SwordmanAbility";

export default class MetalThorns extends SwordmanAbility{

    pointed: boolean = false

    constructor(owner: Swordman){
        super(owner)
        this.name = 'metal thorns'
        this.cost = 5
        this.cd = 20000
    }

    canUse(): boolean {
        return this.owner.resource >= this.cost && !this.owner.is_attacking && !this.used
    }

    use(){
        if(this.owner.is_attacking || this.used) return

        this.owner.is_attacking = true
        this.owner.state = 'cast'

        let attack_move_speed_penalty = this.owner.getAttackMoveSpeedPenalty()
        this.owner.addMoveSpeedPenalty(-attack_move_speed_penalty)
        this.owner.using_ability = this
        this.owner.stateAct = this.act
        let attack_speed = this.owner.cast_speed

        this.owner.action_time = attack_speed
        this.owner.setImpactTime(85)

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.addMoveSpeedPenalty(attack_move_speed_penalty)
            this.owner.hit = false
            this.owner.is_attacking = false
            this.afterUse()
        }
    }

    impact(){
        this.owner.level.sounds.push({
            name: 'holy cast',
            x: this.owner.x,
            y: this.owner.y
        })

        this.used = true
        this.owner.hit = true
        
        let status = new MetalThornsStatus(this.owner.time)
        status.pointed = this.pointed
        status.frequency = this.owner.getAttackSpeed()

        status.setDuration(10000)
        
        this.owner.level.setStatus(this.owner, status)
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