import Cultist from '../../Objects/src/PlayerClasses/Cultist'
import Ability from '../Ability'

export default abstract class CultistAbility extends Ability {
    owner: Cultist

    constructor(owner: Cultist) {
        super(owner)
        this.owner = owner
    }
}
