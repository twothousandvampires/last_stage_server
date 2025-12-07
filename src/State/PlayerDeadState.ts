import Func from '../Func'
import IUnitState from '../Interfaces/IUnitState'
import GoingUpStar from '../Objects/Effects/GoingUpStar'
import Character from '../Objects/src/Character'
import PlayerIdleState from './PlayerIdleState'

export default class PlayerDeadState implements IUnitState<Character> {
    move_reduce_value = 0

    enter(player: Character) {
        player.state = 'dead'
        player.dead_time = player.level.time

        if (!player.can_ressurect) {
            player.level.playerDead()
        }
    }

    update(player: Character) {
        if (player.can_ressurect && player.level.time - player.dead_time >= 3000) {
            let count = 5

            let zones = 6.28 / count

            for (let i = 1; i <= count; i++) {
                let min_a = (i - 1) * zones
                let max_a = i * zones

                let angle = Math.random() * (max_a - min_a) + min_a
                let proj = new GoingUpStar(player.level)
                proj.setPoint(
                    player.x + Math.sin(angle) * Func.random(2, 5),
                    player.y + Math.cos(angle) * Func.random(2, 5)
                )

                player.level.binded_effects.push(proj)
            }

            player.is_dead = false
            player.can_be_controlled_by_player = true
            player.life_status = player.max_life
            player.can_ressurect = false
            player.getState()
        }
    }

    exit(player: Character) {}
}
