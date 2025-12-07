import Ability from '../Abilities/Ability'
import Func from '../Func'
import Devour from '../Objects/Effects/Devour'
import Character from '../Objects/src/Character'
import Mastery from './Mastery'

export default class VoidDevouring extends Mastery {
    constructor() {
        super()
        this.name = 'devouring void'
        this.description = 'There is a chance that the void will absorb nearby enemy.'
    }

    trigger(player: Character, ability: Ability) {
        for (let i = 0; i < player.level.enemies.length; i++) {
            let e = player.level.enemies[i]

            if (!e.is_dead && e.can_be_removed && Func.distance(player, e) <= 10) {
                player.level.check(e)
                player.level.removeEnemy(e)

                let effect = new Devour(player.level)
                effect.setPoint(e.x, e.y)

                player.level.effects.push(effect)

                return
            }
        }
    }
}
