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

    use(){
        this.owner.using_ability = this
        this.owner.pay_to_cost = this.cost
        this.owner.setState(this.owner.setCastAct)
    }

    impact(){
        let second = this.owner.getSecondResource()
        this.used = true
        let status = new CursedWeaponStatus(this.owner.level.time, this.drinker)
        status.setDuration(8000 + second * 200)
        
        this.owner.level.setStatus(this.owner, status)

        this.owner.level.sounds.push({
            name:'dark cast',
            x: this.owner.x,
            y: this.owner.y
        })
    }
}