import IUnitState from '../Interfaces/IUnitState'
import Character from '../Objects/src/Character'

export default class PlayerDefendState implements IUnitState<Character> {
    move_reduce_value = 0

    enter(player: Character) {
        player.state = 'defend'
        player.startDefend()

        this.move_reduce_value = player.getMoveSpeedReduceWhenBlock()
        if (this.move_reduce_value < 0) {
            this.move_reduce_value = 0
        }
        player.addMoveSpeedPenalty(-this.move_reduce_value)
    }

    update(player: Character) {
        if (!player.pressed[32]) {
            player.getState()
        }
    }

    exit(player: Character) {
        player.addMoveSpeedPenalty(this.move_reduce_value)
    }
}
