import Func from '../Func'
import Enemy from '../Objects/src/Enemy/Enemy'
import ExplodingSkull from '../Objects/src/Enemy/ExplodingSkull'
import { Flamy } from '../Objects/src/Enemy/Flamy'
import Impy from '../Objects/src/Enemy/Impy'
import EnemyAbility from './EnemyAbility'

export default class ExplodingSkulls extends EnemyAbility {
    cooldown: number = 20000
    last_used_time: number = Date.now()

    canUse(enemy: Enemy) {
        return enemy.level.time - this.last_used_time >= this.cooldown && enemy.target
    }

    use(enemy: Enemy) {
        this.last_used_time = enemy.level.time
        if (!enemy.target) return

        let count = enemy.level.enemies.filter(
            elem =>
                !elem.is_dead &&
                Func.distance(enemy.target, elem) <= 15 &&
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

        let skull_count = Func.random(2, 4)
        let ids = []

        for (let i = 0; i < skull_count; i++) {
            let s = new ExplodingSkull(enemy.level)
            let a = Math.random() * 6.28
            s.setPoint(
                enemy.x + Func.random(3, 6) * Math.sin(a),
                enemy.y + Func.random(3, 6) * Math.cos(a)
            )
            let t = Func.getRandomFromArray(count.filter(elem => !ids.includes(elem.id)))
            if (t) {
                s.target = t
                ids.push(t.id)

                enemy.level.enemies.push(s)
            }
        }
    }
}
