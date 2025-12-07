import Ability from '../Abilities/Ability'
import Heal from '../Objects/Effects/Heal'
import Character from '../Objects/src/Character'
import Mastery from './Mastery'

export default class Recovery extends Mastery {
    constructor() {
        super()
        this.name = 'recovery'
        this.description = 'When you start ability there is a chance to get life.'
    }

    trigger(player: Character, ability: Ability) {
        let e = new Heal(player.level)
        e.setPoint(player.x, player.y)
        player.level.addEffect(e)

        player.addLife()
    }
}
