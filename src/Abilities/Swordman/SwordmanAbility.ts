import Swordman from '../../Objects/src/PlayerClasses/Swordman'
import Ability from '../Ability'

export default abstract class SwordmanAbility extends Ability {
    owner: Swordman

    constructor(owner: Swordman) {
        super(owner)
        this.owner = owner
    }
}
