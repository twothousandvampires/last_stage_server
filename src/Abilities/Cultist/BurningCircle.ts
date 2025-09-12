import Cultist from "../../Objects/src/PlayerClasses/Cultist";
import BurningCircleStatus from "../../Status/BurningCircleStatus";
import CultistAbility from "./CultistAbility";

export default class BurningCircle extends CultistAbility{

    consuming: boolean
    hatred: boolean
    devouring: boolean

    constructor(owner: Cultist){
        super(owner)
        this.name = 'burning circle'
        this.cost = 4
        this.consuming = false
        this.hatred = false
        this.devouring = false
        this.cd = 12000
    }

    canUse(): boolean {
        return this.owner.resource >= this.cost && !this.used && !this.owner.is_attacking
    }

    use(){
        this.used = true
        this.owner.is_attacking = true
        this.owner.state = 'cast'
     
        this.owner.stateAct = this.act
        let cact_speed = this.owner.getCastSpeed()
        this.owner.addMoveSpeedPenalty(-70)

        this.owner.action_time = cact_speed

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.afterUse()
            this.owner.addMoveSpeedPenalty(70)
            this.owner.hit = false
            this.owner.is_attacking = false
        }
    }

    act(){
        if(this.action && !this.hit){
            this.hit = true
            
            this.takeDamage()

            this.level.sounds.push({
                    name:'fire cast',
                    x: this.x,
                    y: this.y
            })

            let status = new BurningCircleStatus(this.time)
            let second = this.getSecondResource()
            status.setFrequency(1800 - second * 150)
            
            status.setDuration(8000)

            if(this.second_ability.consuming){
                status.setRadius(20)
            }

            if(this.second_ability.hatred){
                status.hatred = true
            }
            
            status.devouring = this.second_ability.devouring

            this.level.setStatus(this, status)
        }
        else if(this.action_is_end){
            this.action_is_end = false
            this.getState()
        }
    }
}