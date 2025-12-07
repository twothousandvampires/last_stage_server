import Func from '../Func'
import IUnitState from '../Interfaces/IUnitState'
import Enemy from '../Objects/src/Enemy/Enemy'

export default class EnemyRetreatState implements IUnitState<Enemy> {
    start = 0
    duration = 2000

    enter(enemy: Enemy) {
        if (!enemy.target) return

        enemy.state = 'move'
        enemy.retreat_angle = Func.angle(enemy.target.x, enemy.target.y, enemy.x, enemy.y)
        enemy.retreat_angle += Math.random() * 1.57 * (Func.random(50) ? -1 : 1)

        this.start = enemy.level.time
    }

    update(enemy: Enemy) {
        if (enemy.level.time - this.start >= this.duration) {
            enemy.getState()
        } else {
            let a = enemy.retreat_angle

            if (!a) return

            enemy.moveByAngle(a)
            enemy.wasChanged()
        }
    }

    exit(enemy: Enemy) {
        enemy.retreat_angle = undefined
    }
}
