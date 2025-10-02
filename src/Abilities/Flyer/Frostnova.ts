import BigFrostNova from "../../Objects/Effects/BigFrostNova";
import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import FlyerAbility from "./FlyerAbility";

export default class Frostnova extends FlyerAbility{

    cost: number
    ice_genesis: boolean
    cold_spires: boolean
   
    constructor(owner: Flyer){
        super(owner)
        this.cost = 7
        this.name = 'frost nova'
        this.ice_genesis = false
        this.cold_spires = false
        this.need_to_pay = true
    }

    impact(){
        this.owner.level.sounds.push({
            name: 'frost nova',
            x: this.owner.x,
            y: this.owner.y
        })

        let e = new BigFrostNova(this.owner.level)
        e.spires = this.cold_spires
        e.genesis = this.ice_genesis
        e.setOwner(this.owner)
        e.setPoint(this.owner.x, this.owner.y)

        this.owner.level.binded_effects.push(e)
    }
}