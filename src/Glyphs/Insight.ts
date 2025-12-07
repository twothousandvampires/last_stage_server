import Ability from '../Abilities/Ability'
import ToothExplode from '../Objects/Effects/ToothExplode'
import Character from '../Objects/src/Character'
import Mastery from './Mastery'

export default class Insight extends Mastery {
    constructor() {
        super()
        this.name = 'insight'
        this.description = 'When you start ability there is a chance to get energy.'
    }

    trigger(player: Character, ability: Ability) {
        let e = new ToothExplode(player.level)
        e.setPoint(player.x, player.y)
        player.level.addEffect(e)

        player.addResourse()
    }
}
