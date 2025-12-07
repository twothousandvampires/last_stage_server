import Func from '../Func'
import { FrostBolt } from '../Objects/Projectiles/FrostBolt'
import Enemy from '../Objects/src/Enemy/Enemy'
import EnemyAbility from './EnemyAbility'

export default class FrostBoltAbility extends EnemyAbility {
    cooldown: number = 10000

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

        let angle = Func.angle(enemy.x, enemy.y, enemy.target.x, enemy.target.y)

        let proj = new FrostBolt(enemy.level)
        proj.setAngle(angle)
        proj.setPoint(enemy.x, enemy.y)
        proj.setOwner(enemy)

        enemy.level.projectiles.push(proj)
    }
}
