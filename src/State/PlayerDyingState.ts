import IUnitState from '../Interfaces/IUnitState'
import Character from '../Objects/src/Character'
import PlayerDeadState from './PlayerDeadState'

export default class PlayerDyingState implements IUnitState<Character> {
    start = 0
    duration = 1500

    enter(player: Character) {
        player.can_be_controlled_by_player = false

        if (player.freezed) {
            player.state = 'freezed_dying'
            player.level.addSound({
                name: 'shatter',
                x: player.x,
                y: player.y,
            })

            player.level.playerDead()
        } else if (player.exploded) {
            player.state = 'explode'
            
            player.level.playerDead()
        } else {
            player.state = 'dying'
        }

        this.start = player.level.time
        player.action_time = this.duration
    }

    update(player: Character) {
        if (player.level.time - this.start >= this.duration) {
            player.setState(new PlayerDeadState())
        }
    }

    exit(player: Character) {}
}
