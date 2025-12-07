import IUnitState from '../Interfaces/IUnitState'
import Character from '../Objects/src/Character'

export default class PlayerAttackState implements IUnitState<Character> {
    move_penalty = 0

    enter(player: Character) {
        player.prepareToAction()
        player.state = 'attack'

        this.move_penalty = player.getMoveSpeedPenaltyValue()

        player.addMoveSpeedPenalty(-this.move_penalty)

        player.action_time = player.getAttackSpeed()
        player.setImpactTime(80)
    }

    update(player: Character) {
        if (player.action && !player.hit) {
            player.hit = true

            if (player.using_ability) {
                player.using_ability.impact()
            }
        } else if (player.action_is_end) {
            player.getState()
        }
    }

    exit(player: Character) {
        player.addMoveSpeedPenalty(this.move_penalty)
    }
}
