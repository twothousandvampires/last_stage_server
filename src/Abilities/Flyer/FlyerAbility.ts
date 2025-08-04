import Flyer from "../../Objects/src/PlayerClasses/Flyer";
import Ability from "./../Ability";

export default abstract class FlyerAbility extends Ability{
    owner: Flyer
    cost: number
   
    constructor(owner: Flyer){
        super(owner)
        this.owner = owner
        this.cost = 0
    }
}