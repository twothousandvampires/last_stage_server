import Func from '../Func'
import { SpecterSoulSeeker } from '../Objects/Projectiles/SpecterSoulSeeker'
import Enemy from '../Objects/src/Enemy/Enemy'
import EnemyAbility from './EnemyAbility'

export default class SoulSeekers extends EnemyAbility {
    cooldown: number = 24000

    canUse(enemy: Enemy) {
        return (
            enemy.level.time - this.last_used_time >= this.cooldown &&
            enemy.target &&
            Func.distance(enemy, enemy.target) <= 25
        )
    }

    use(enemy: Enemy) {
        this.last_used_time = enemy.level.time

        let c = 8
        let zones = 6.28 / c

        for (let i = 1; i <= c; i++) {
            let min_a = (i - 1) * zones
            let max_a = i * zones

            let angle = Math.random() * (max_a - min_a) + min_a
            let proj = new SpecterSoulSeeker(enemy.level)
            proj.setAngle(angle)
            proj.setPoint(enemy.x, enemy.y)
            proj.setOwner(enemy)

            enemy.level.projectiles.push(proj)
        }
    }
}
