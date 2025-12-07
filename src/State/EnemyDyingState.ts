import Func from '../Func'
import IUnitState from '../Interfaces/IUnitState'
import Enemy from '../Objects/src/Enemy/Enemy'

export default class EnemyDyingState implements IUnitState<Enemy> {
    start = 0

    enter(enemy: Enemy) {
        enemy.invisible = false
        this.start = enemy.level.time

        enemy.level.players.forEach(elem => {
            if (Func.distance(enemy, elem) <= 20) {
                elem.enemyDeadNearby(enemy)
            }
        })

        if (enemy.freezed) {
            enemy.state = 'freeze_dying'
            enemy.destroyed = true
            enemy.level.sounds.push({
                name: 'shatter',
                x: enemy.x,
                y: enemy.y,
            })
        } else if (enemy.burned) {
            enemy.state = 'burn_dying'
            enemy.destroyed = true
        } else if (enemy.exploded) {
            enemy.destroyed = true
            enemy.state = 'explode'
        } else {
            enemy.deadSound()
            enemy.state = 'dying'
        }
    }

    update(enemy: Enemy) {
        if (enemy.level.time - this.start >= enemy.dying_time) {
            if (!enemy.destroyed) {
                enemy.afterDead()
            }

            if (!enemy.has_boby || enemy.destroyed) {
                enemy.level.check(enemy)
                enemy.level.removeEnemy(enemy)
            } else {
                enemy.getState()
            }
        }
    }

    exit(player: Enemy) {}
}
