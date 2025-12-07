import Func from '../Func'
import SpecterVortex from '../Objects/Effects/SpecterVortex'
import Enemy from '../Objects/src/Enemy/Enemy'
import EnemyAbility from './EnemyAbility'

export default class SoulVortex extends EnemyAbility {
    cooldown: number = 16000

    canUse(enemy: Enemy) {
        return (
            enemy.level.time - this.last_used_time >= this.cooldown &&
            enemy.target &&
            Func.distance(enemy, enemy.target) <= 12
        )
    }

    use(enemy: Enemy) {
        this.last_used_time = enemy.level.time

        let vortex = new SpecterVortex(enemy.level)
        vortex.setOwner(enemy)
        vortex.setPoint(enemy.x, enemy.y)

        enemy.level.binded_effects.push(vortex)
    }
}
