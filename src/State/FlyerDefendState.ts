import IUnitState from '../Interfaces/IUnitState'
import Flyer from '../Objects/src/PlayerClasses/Flyer'
import PlayerIdleState from './PlayerIdleState'

export default class FlyerDefendState implements IUnitState<Flyer> {
    move_reduce_value = 0

    enter(player: Flyer) {
        player.startDefend()
        player.state = 'defend'

        player.can_regen_resource = player.allow_mana_regen_while_def

        player.phasing = player.takeoff
    }

    update(player: Flyer) {
        if (!player.pressed[32]) {
            player.getState()
        }
    }

    exit(player: Flyer) {
        player.can_regen_resource = true
        player.phasing = false
    }
}
