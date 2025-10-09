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

    impact(){
        this.owner.level.sounds.push({
            name: 'holy cast',
            x: this.owner.x,
            y: this.owner.y
        })

        this.used = true
        this.owner.hit = true
        
        let status = new MetalThornsStatus(this.owner.level.time)
        status.pointed = this.pointed
        status.frequency = this.owner.getAttackSpeed()

        status.setDuration(10000)
        
        this.owner.level.setStatus(this.owner, status)
    }
}