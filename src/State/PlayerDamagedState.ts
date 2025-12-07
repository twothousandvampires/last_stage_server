import IUnitState from '../Interfaces/IUnitState'
import Character from '../Objects/src/Character'
import PlayerIdleState from './PlayerIdleState'

export default class PlayerDamagedState implements IUnitState<Character> {
    start = 0
    duration = 300

    enter(player: Character) {
        player.damaged = true
        player.state = 'damaged'
        player.can_be_controlled_by_player = false

        this.start = player.level.time
    }

    update(player: Character) {
        if (player.level.time - this.start >= this.duration) {
            player.getState()
        }
    }

    exit(player: Character) {
        player.can_be_controlled_by_player = true
        player.damaged = false
    }
}
