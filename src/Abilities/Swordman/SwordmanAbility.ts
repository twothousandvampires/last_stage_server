import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import Ability from "./../Ability";

export default abstract class SwordmanAbility extends Ability{
    owner: Swordman
    cost: number
    
    constructor(owner: Swordman){
        super(owner)
        this.owner = owner
        this.cost = 0
    }
}