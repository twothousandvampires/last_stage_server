import Func from '../Func'
import { SwirlingMucusProj } from '../Objects/Projectiles/SwirlingMucus'
import Enemy from '../Objects/src/Enemy/Enemy'
import EnemyAbility from './EnemyAbility'

export default class SwirlingMucus extends EnemyAbility {
    
    cooldown: number = 25000

    canUse(enemy: Enemy) {
        return (
            enemy.level.time - this.last_used_time >= this.cooldown &&
            enemy.target &&
            Func.distance(enemy, enemy.target) <= 12
        )
    }

    async use(enemy: Enemy) {
        this.last_used_time = enemy.level.time
        if (!enemy.target) return

        let count = 4
        
        for (let i = 1; i <= count; i++) {
            await Func.sleep(Func.random(150, 300))

            let proj1 = new SwirlingMucusProj(enemy.level, Func.random(2 * i, 2 * (i * 2)))
            proj1.setAngle(Math.random() * 6.28)
            proj1.setOwner(enemy)

            enemy.level.projectiles.push(proj1)
        }
    }
}