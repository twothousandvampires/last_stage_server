import Func from '../Func'
import { SharpedBone } from '../Objects/Projectiles/SharpedBone'
import Enemy from '../Objects/src/Enemy/Enemy'
import Undead from '../Objects/src/Enemy/Undead'
import EnemyAbility from './EnemyAbility'

export default class FanOfBonesAbility extends EnemyAbility {
    cooldown: number = 16000

    canUse(enemy: Enemy) {
        return enemy.level.time - this.last_used_time >= this.cooldown && enemy.target
    }

    use(enemy: Enemy) {
        this.last_used_time = enemy.level.time
        if (!enemy.target) return

        enemy.level.sounds.push({
            name: 'dark cast',
            x: enemy.x,
            y: enemy.y,
        })

        let bone_count = enemy.level.enemies.filter(
            elem => elem instanceof Undead && Func.distance(enemy, elem) <= 20
        ).length
        bone_count++

        if (bone_count > 12) {
            bone_count = 12
        }

        let zones = 6.28 / bone_count

        for (let i = 1; i <= bone_count; i++) {
            let min_a = (i - 1) * zones
            let max_a = i * zones

            let angle = Math.random() * (max_a - min_a) + min_a
            let proj = new SharpedBone(enemy.level)
            proj.setAngle(angle)
            proj.setPoint(enemy.x, enemy.y)

            enemy.level.projectiles.push(proj)
        }
    }
}
