import Cultist from "../../Objects/src/PlayerClasses/Cultist";
import Ability from "../Ability";

export default abstract class CultistAbility extends Ability{
    owner: Cultist
    cost: number
    used: boolean
    
    constructor(owner: Cultist){
        super(owner)
        this.owner = owner
        this.cost = 0
        this.used = false
    }
}