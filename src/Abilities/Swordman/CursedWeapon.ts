import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import CursedWeaponStatus from "../../Status/CursedWeaponStatus";
import SwordmanAbility from "./SwordmanAbility";

export default class CursedWeapon extends SwordmanAbility{

    drinker: boolean

    constructor(owner: Swordman){
        super(owner)
        this.drinker = false
        this.name = 'cursed weapon'
        this.cd = 12000
    }

    canUse(): boolean {
        return !this.used
    }

    use(): void {
        if(this.used) return

        this.used = true

        this.owner.state = 'cast'

        this.owner.action_time = this.owner.cast_speed
        this.owner.setImpactTime(80)

        this.owner.stateAct = this.getAct()

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.action_time = undefined
            this.afterUse()
        }
    }

    getAct(){
        let ability = this
        let owner = this.owner

        return function(){
            if(owner.action){
                let second = this.getSecondResource()

                let status = new CursedWeaponStatus(this.level.time, ability.drinker)
                status.setDuration(8000 + second * 200)
                
                this.level.setStatus(this, status)

                this.level.sounds.push({
                    name:'dark cast',
                    x: this.x,
                    y: this.y
                })
            }
            else if(owner.action_is_end){
                owner.action_is_end = false
                owner.getState()
            }
        }
    }
}