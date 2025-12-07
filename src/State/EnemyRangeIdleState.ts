import Func from '../Func'
import IUnitState from '../Interfaces/IUnitState'
import Enemy from '../Objects/src/Enemy/Enemy'
import EnemyAttackState from './EnemyAttackState'
import EnemyCastState from './EnemyCastState'
import EnemyRetreatState from './EnemyRetreatState'

export default class EnemyRangeIdleState implements IUnitState<Enemy> {
    timer = 500
    last_desicion = 0

    enter(enemy: Enemy) {
        enemy.state = 'idle'
    }

    update(enemy: Enemy) {
        enemy.checkPlayer()

        if (!enemy.target) {
            return
        }

        if (enemy.level.time - this.last_desicion >= this.timer) {
            this.last_desicion = enemy.level.time
            let distance = Func.distance(enemy, enemy.target)

            if (distance <= enemy.retreat_distance && Func.chance(35)) {
                enemy.setState(new EnemyRetreatState())
            } else if (enemy.enemyCanAtack()) {
                if (enemy.isAbilityToUse()) {
                    enemy.setState(new EnemyCastState())
                } else {
                    enemy.setState(new EnemyAttackState())
                }
            }
        }
    }

    exit(player: Enemy) {}
}
