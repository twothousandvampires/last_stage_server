import Func from '../Func'
import IUnitState from '../Interfaces/IUnitState'
import Enemy from '../Objects/src/Enemy/Enemy'
import EnemyAttackState from './EnemyAttackState'
import EnemyCastState from './EnemyCastState'

export default class EnemyMoveState implements IUnitState<Enemy> {
    enter(enemy: Enemy) {
        enemy.state = 'move'
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
        } else if (is_collision) {
            enemy.setState(enemy.getIdleStateInstance())
        } else {
            let a = Func.angle(enemy.x, enemy.y, enemy.target.x, enemy.target.y)

            enemy.moveByAngle(a)
            enemy.wasChanged()
        }
    }

    exit(player: Enemy) {}
}
