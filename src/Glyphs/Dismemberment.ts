import Ability from '../Abilities/Ability'
import Character from '../Objects/src/Character'
import DismembermentStatus from '../Status/DismembermentStatus'
import Mastery from './Mastery'

export default class Dismemberment extends Mastery {
    constructor() {
        super()
        this.name = 'dismemberment'
        this.description =
            'When you start ability there is a chance to increase critical rate and power.'
    }

    trigger(player: Character, ability: Ability) {
        let status = new DismembermentStatus(player.level.time)

        status.setDuration(8000)
        player.level.setStatus(player, status, true)
    }
}
