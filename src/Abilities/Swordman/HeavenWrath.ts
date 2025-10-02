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
        this.need_to_pay = true
    }

    impact(){
        this.owner.level.sounds.push({
            name: 'holy cast',
            x: this.owner.x,
            y: this.owner.y
        })

        let s = new HeavenWrathStatus(this.owner.level.time)
        s.setDuration(10000)

        this.owner.level.setStatus(this.owner, s)
    }
}