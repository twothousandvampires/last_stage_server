import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import CursedWeaponStatus from "../../Status/CursedWeaponStatus";
import SwordmanAbility from "./SwordmanAbility";

export default class CursedWeapon extends SwordmanAbility{
    cd: boolean
    cast: boolean
    drinker: boolean

    constructor(owner: Swordman){
        super(owner)
        this.cd = false
        this.cast = false
        this.drinker = false
        this.name = 'cursed weapon'
    }

    canUse(): boolean {
        return !this.cd
    }

    use(): void {
        if(this.cd) return 
        this.cd = true

        setTimeout(() => {
            this.cd = false
            this.cast = false
        }, 20000)

        this.owner.state = 'cast'
        this.owner.can_move_by_player = false

        this.owner.stateAct = this.getAct()

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.can_move_by_player = true
            this.owner.action_time = undefined
            this.cast = false
        }

        this.owner.action_time = 1500
    
        setTimeout(() => {
            this.cast = true
        }, 1500)
    }

    getAct(){
        let ability = this

        return function(){
            if(ability.cast){
                let second = this.getSecondResource()

                let status = new CursedWeaponStatus(this.time, ability.drinker)
                status.setDuration(8000 + second * 200)
                
                this.level.setStatus(this, status)

                this.level.sounds.push({
                    name:'dark cast',
                    x: this.x,
                    y: this.y
                })

                ability.cast = false
                this.getState()
            }
        }
    }
}