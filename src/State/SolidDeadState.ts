import Func from '../Func'
import IUnitState from '../Interfaces/IUnitState'
import Enemy from '../Objects/src/Enemy/Enemy'

export default class SolidDeadState implements IUnitState<Enemy> {
    start = 0

    enter(enemy: Enemy) {
        enemy.state = 'dead'
        enemy.level.check(enemy)

        enemy.is_corpse = true
        enemy.action_time = enemy.dead_time

        this.start = enemy.level.time
    }

    update(enemy: Enemy) {
        if (enemy.level.time - this.start >= enemy.action_time) {
            enemy.state = 'dead_explode'

            enemy.level.enemies.forEach(elem => {
                if (elem != enemy && Func.distance(enemy, elem) <= 12) {
                    elem.takeDamage(undefined, {
                        burn: true,
                    })
                }
            })

            enemy.level.players.forEach(elem => {
                if (Func.distance(enemy, elem) <= 12) {
                    elem.takeDamage()
                }
            })

            enemy.wasChanged()
            enemy.level.removeEnemy(enemy, false)
        }
    }

    exit(player: Enemy) {}
}
