import IUnitState from '../Interfaces/IUnitState'
import Enemy from '../Objects/src/Enemy/Enemy'

export default class EnemyDeadState implements IUnitState<Enemy> {
    start = 0

    enter(enemy: Enemy) {
        enemy.is_corpse = true
        enemy.state = 'dead'
        enemy.level.check(enemy)
        enemy.action_time = enemy.dead_time

        this.start = enemy.level.time
    }

    update(enemy: Enemy) {
        if (enemy.level.time - this.start >= enemy.dead_time) {
            enemy.level.removeEnemy(enemy)
        }
    }

    exit(player: Enemy) {}
}
