import Ability from '../Abilities/Ability'
import Heal from '../Objects/Effects/Heal'
import Character from '../Objects/src/Character'
import Mastery from './Mastery'

export default class Cleansing extends Mastery {
    constructor() {
        super()
        this.name = 'cleansing'
        this.description = 'Removes one negative status.'
    }

    trigger(player: Character, ability: Ability) {
        let e = new Heal(player.level)
        e.setPoint(player.x, player.y)

        player.level.addEffect(e)

        const index = player.level.status_pull.findIndex(
            s => s.unit === player && s.need_to_check_resist
        )

        if (index !== -1) {
            player.level.status_pull[index].clear()
            player.level.status_pull.splice(index, 1)
        }
    }
}