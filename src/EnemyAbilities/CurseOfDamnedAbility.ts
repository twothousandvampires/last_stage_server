import Func from '../Func'
import Enemy from '../Objects/src/Enemy/Enemy'
import CurseOfDamned from '../Status/CurseOfDamned'
import EnemyAbility from './EnemyAbility'

export default class CurseOfDamnedAbility extends EnemyAbility {
    cooldown: number = 22000

    canUse(enemy: Enemy) {
        return (
            enemy.level.time - this.last_used_time >= this.cooldown &&
            enemy.target &&
            Func.distance(enemy, enemy.target) <= 20
        )
    }

    use(enemy: Enemy) {
        this.last_used_time = enemy.level.time
        if (!enemy.target) return

        let status = new CurseOfDamned(enemy.level.time)
        status.setDuration(4000)
        enemy.level.setStatus(enemy.target, status)
    }
}
