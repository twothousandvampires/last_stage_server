import Ability from '../Abilities/Ability'
import Character from '../Objects/src/Character'
import TurtleShellStatus from '../Status/TurtleShell'
import Mastery from './Mastery'

export default class TurtleShell extends Mastery {
    constructor() {
        super()
        this.name = 'turtle shell'
        this.description =
            'When you start ability there is a chance to increase armour and fortification.'
    }

    trigger(player: Character, ability: Ability) {
        let status = new TurtleShellStatus(player.level.time)

        status.setDuration(8000)
        player.level.setStatus(player, status, true)
    }
}
