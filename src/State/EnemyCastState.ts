import Func from '../Func'
import IUnitState from '../Interfaces/IUnitState'
import Enemy from '../Objects/src/Enemy/Enemy'

export default class EnemyCastState implements IUnitState<Enemy> {
    was_invisible = false

    enter(enemy: Enemy) {
        enemy.state = enemy.getCastStateString()
        enemy.is_attacking = true
        enemy.action_time = enemy.cast_speed

        if (enemy.target) {
            enemy.hit_x = enemy.target.x
            enemy.hit_y = enemy.target.y
            enemy.attack_angle = Func.angle(enemy.x, enemy.y, enemy.target.x, enemy.target.y)
        }

        enemy.setImpactTime(80)

        this.was_invisible = enemy.invisible

        enemy.invisible = false
    }

    update(enemy: Enemy) {
        if (enemy.action && !enemy.hit) {
            enemy.hit = true
            let abilities = enemy.abilities.filter(elem => elem.canUse(enemy))
            let ability = Func.getRandomFromArray(abilities)

            if (ability) {
                enemy.castImpact()
                ability.use(enemy)
            }
        } else if (enemy.action_is_end) {
            enemy.getState()
        }
    }

    exit(enemy: Enemy) {
        enemy.action = false
        enemy.hit = false
        enemy.is_attacking = false
        enemy.attack_angle = undefined

        enemy.invisible = this.was_invisible
    }
}
