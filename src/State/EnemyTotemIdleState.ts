import Pile from '../Objects/src/Piles/Pile'
import EnemyCastState from './EnemyCastState'
import EnemyDyingState from './EnemyDyingState'

export default class EnemyTotemIdleState implements IUnitState<Pile> {
    enter(enemy: Pile) {
        enemy.state = 'idle'
        if (!enemy.created) {
            enemy.created = enemy.level.time
        }
    }

    update(enemy: Pile) {
        let d = enemy.level.time - enemy.created

        if (d >= enemy.duration) {
            enemy.is_dead = true
            enemy.setState(new EnemyDyingState())
        } else {
            enemy.checkPlayer()

            if (!enemy.target) {
                return
            }

            if (enemy.isAbilityToUse()) {
                enemy.setState(new EnemyCastState())
            }
        }
    }

    exit(player: Pile) {}
}
