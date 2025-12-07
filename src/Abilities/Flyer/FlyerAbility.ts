import Flyer from '../../Objects/src/PlayerClasses/Flyer'
import Ability from '../Ability'

export default abstract class FlyerAbility extends Ability {
    owner: Flyer

    constructor(owner: Flyer) {
        super(owner)
        this.owner = owner
    }
}
