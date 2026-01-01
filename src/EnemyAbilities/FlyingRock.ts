import Func from '../Func'
import { FlyingRockProj } from '../Objects/Projectiles/FlyingRockProj'
import Enemy from '../Objects/src/Enemy/Enemy'
import EnemyAbility from './EnemyAbility'

export default class FlyingRock extends EnemyAbility {

    cooldown: number = 20000

    canUse(enemy: Enemy) {
        return (
            enemy.level.time - this.last_used_time >= this.cooldown &&
            enemy.target &&
            Func.distance(enemy, enemy.target) >= 20
        )
    }

    use(enemy: Enemy) {
        this.last_used_time = enemy.level.time
        if (!enemy.target) return

        let proj = new FlyingRockProj(enemy.level)
        proj.setAngle(Func.angle(enemy.x, enemy.y, enemy.target.x, enemy.target.y))
        proj.setPoint(enemy.x, enemy.y)
        proj.setOwner(enemy)

        enemy.level.projectiles.push(proj)
    }
}