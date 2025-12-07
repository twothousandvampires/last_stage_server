import Func from '../Func'
import { Spark } from '../Objects/Projectiles/Spark'
import Enemy from '../Objects/src/Enemy/Enemy'
import EnemyAbility from './EnemyAbility'

export default class EnemySparks extends EnemyAbility {
    cooldown: number = 20000

    canUse(enemy: Enemy) {
        return (
            enemy.level.time - this.last_used_time >= this.cooldown &&
            enemy.target &&
            Func.distance(enemy, enemy.target) <= 30
        )
    }

    use(enemy: Enemy) {
        this.last_used_time = enemy.level.time
        if (!enemy.target) return

        let count = 10
        let zones = 6.28 / count

        for (let i = 1; i <= count; i++) {
            let min_a = (i - 1) * zones
            let max_a = i * zones

            let angle = Math.random() * (max_a - min_a) + min_a

            let proj = new Spark(enemy.level, 1, 3000)

            proj.setAngle(angle)
            proj.setPoint(enemy.x, enemy.y)
            proj.by_enemy = true

            enemy.level.projectiles.push(proj)
        }
    }
}
