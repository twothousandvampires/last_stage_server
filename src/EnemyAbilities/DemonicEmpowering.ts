import Func from '../Func'
import Enemy from '../Objects/src/Enemy/Enemy'
import { Flamy } from '../Objects/src/Enemy/Flamy'
import Impy from '../Objects/src/Enemy/Impy'
import EnemyAbility from './EnemyAbility'

export default class DemonicEmpowering extends EnemyAbility {
    cooldown: number = 30000
    last_used_time: number = Date.now()

    canUse(enemy: Enemy) {
        return enemy.level.time - this.last_used_time >= this.cooldown && enemy.target
    }

    use(enemy: Enemy) {
        this.last_used_time = enemy.level.time

        let count = enemy.level.enemies.filter(
            elem =>
                !elem.is_dead &&
                Func.distance(enemy, elem) <= 12 &&
                (elem instanceof Flamy || elem instanceof Impy)
        )

        if (count.length < 3) return

        if (Func.chance(20)) {
            enemy.level.sounds.push({
                name: 'demon roar',
                x: enemy.x,
                y: enemy.y,
            })
        }

        count.forEach(elem => {
            elem.move_speed_penalty += 10
            elem.attack_speed -= 150
            elem.armour_rate += 10
            elem.pierce += 10

            if (elem.attack_speed <= 100) {
                elem.attack_speed = 100
            }

            if (elem.move_speed_penalty >= 100) {
                elem.move_speed_penalty = 100
            }
        })
    }
}
