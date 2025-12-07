import Func from '../Func'
import IUnitState from '../Interfaces/IUnitState'
import { Enemy } from '../Objects/src/Enemy/Enemy'

export default class EnemyAttackState implements IUnitState<Enemy> {
    enter(enemy: Enemy) {
        enemy.state = 'attack'
        enemy.is_attacking = true
        enemy.action_time = enemy.attack_speed

        enemy.hit_x = enemy.target.x
        enemy.hit_y = enemy.target.y

        enemy.setImpactTime(80)

        enemy.attack_angle = Func.angle(enemy.x, enemy.y, enemy.target.x, enemy.target.y)
    }

    update(enemy: Enemy) {
        if (enemy.action && !enemy.hit) {
            enemy.hit = true
            enemy.hitImpact()
        } else if (enemy.action_is_end) {
            enemy.getState()
        }
    }

    exit(enemy: Enemy) {
        enemy.action = false
        enemy.hit = false
        enemy.is_attacking = false
        enemy.attack_angle = undefined
    }
}
