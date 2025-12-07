import Func from '../Func'
import { SharpedBone } from '../Objects/Projectiles/SharpedBone'
import Enemy from '../Objects/src/Enemy/Enemy'
import Undead from '../Objects/src/Enemy/Undead'
import EnemyAbility from './EnemyAbility'

export default class LaunchBones extends EnemyAbility {
    cooldown = 12000

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

        let bone_count = enemy.level.enemies.filter(
            elem => elem instanceof Undead && Func.distance(enemy, elem) <= 20
        ).length
        bone_count++

        if (bone_count > 12) {
            bone_count = 12
        }

        let angle = Func.angle(enemy.x, enemy.y, enemy.target.x, enemy.target.y)

        for (let i = 0; i < bone_count; i++) {
            let proj = new SharpedBone(enemy.level)
            proj.setPoint(enemy.x, enemy.y)
            proj.setOwner(enemy)
            let a = angle + i * 0.15

            proj.setAngle(a)

            enemy.level.projectiles.push(proj)
        }
    }
}
