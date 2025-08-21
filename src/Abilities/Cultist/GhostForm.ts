import Func from "../../Func";
import Cultist from "../../Objects/src/PlayerClasses/Cultist";
import AfterlifeCold from "../../Status/AfterlifeCold";
import Weakness from "../../Status/Weakness";
import CultistAbility from "./CultistAbility";

export default class GhostForm extends CultistAbility{

    cd: boolean
    lead: boolean
    afterlife_cold: boolean

    constructor(owner: Cultist){
        super(owner)
        this.cd = false
        this.lead = false
        this.afterlife_cold = false
        this.name = 'ghost form'
    }

    canUse(): boolean {
        return !this.cd
    }

    use(): void {
        if(this.cd) return 

        this.cd = true

        setTimeout(() => {
            this.cd = false
        }, 20000)

        this.owner.action_time = 500
        this.owner.can_be_damaged = false
        this.owner.phasing = true
        this.owner.can_attack = false
        this.owner.can_cast = false
        this.owner.state = 'start ghost'
        
        setTimeout(() => {
            this.owner.state = 'ghost'
            let ghost_time = 3000 + this.owner.getSecondResource() * 250
            this.owner.setTimerToGetState(ghost_time)

            if(this.afterlife_cold){
                let status = new AfterlifeCold(this.owner.time)
                status.setDuration(ghost_time)

                this.owner.level.setStatus(this.owner, status)
            }

            if(this.lead){
                let r = this.owner.getBoxElipse()
                r.r = 15
                this.owner.level.players.forEach(elem => {
                    if(elem != this.owner && Func.elipseCollision(elem.getBoxElipse(), r)){
                        elem.phasing = true
                        let status = new Weakness(this.owner.time)
                        status.setDuration(ghost_time)

                        this.owner.level.setStatus(elem, status)

                        setTimeout(() => {
                            elem.phasing = false
                        }, ghost_time)
                    }
                })
            }
        }, 500)

        this.owner.cancelAct = () => {
            this.owner.can_be_damaged = true
            this.owner.phasing = false
            this.owner.can_attack = true
            this.owner.can_cast = true
        }
    }
}