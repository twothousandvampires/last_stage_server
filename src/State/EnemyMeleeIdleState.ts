import Func from '../Func'
import IUnitState from '../Interfaces/IUnitState'
import Enemy from '../Objects/src/Enemy/Enemy'
import EnemyAttackState from './EnemyAttackState'
import EnemyCastState from './EnemyCastState'
import EnemyMoveAct from './EnemyMoveState'

export default class EnemyMeleeIdleState implements IUnitState<Enemy> {
    enter(enemy: Enemy) {
        enemy.state = 'idle'
    }

    update(enemy: Enemy) {
        enemy.checkPlayer()

        if (!enemy.target) {
            return
        }

        let a_e = enemy.getBoxElipse()
        a_e.r = enemy.attack_radius

        let is_collision = Func.elipseCollision(a_e, enemy.target.getBoxElipse())

        if (enemy.enemyCanAtack() && is_collision) {
            enemy.setState(new EnemyAttackState())
        } else if (enemy.enemyCanAtack() && enemy.isAbilityToUse()) {
            enemy.setState(new EnemyCastState())
        } else if (!is_collision) {
            enemy.setState(new EnemyMoveAct())
        }
    }

    exit(player: Enemy) {}
}
