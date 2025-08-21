import Cultist from "../../Objects/src/PlayerClasses/Cultist";
import BurningCircleStatus from "../../Status/BurningCircleStatus";
import CultistAbility from "./CultistAbility";

export default class BurningCircle extends CultistAbility{

    constructor(owner: Cultist){
        super(owner)
        this.name = 'burning circle'
        this.cost = 4
    }

    canUse(): boolean {
        return this.owner.getSecondResource() >= this.cost && this.owner.can_attack
    }

    afterUse(){
        this.owner.useNotUtilityTriggers.forEach(elem => {
                elem.trigger(this.owner)
        })
    }

    use(){
        if(this.owner.is_attacking) return
        
        this.owner.pay_to_cost = this.cost

        this.owner.is_attacking = true
        this.owner.state = 'cast'
     
        this.owner.stateAct = this.act
        let cact_speed = this.owner.getCastSpeed()

        this.owner.action_time = cact_speed

        this.owner.cancelAct = () => {
            this.owner.action = false
    
            setTimeout(()=>{
                this.owner.hit = false
                this.owner.is_attacking = false
            },50)
        }

        this.owner.setTimerToGetState(cact_speed)
    }

    act(){
        if(this.action && !this.hit){
            this.hit = true
            
             this.level.sounds.push({
                    name:'fire cast',
                    x: this.x,
                    y: this.y
            })

            let status = new BurningCircleStatus(this.time)
            status.setDuration(20000)

            this.level.setStatus(this, status)

            this.payCost()
        }
    }
}