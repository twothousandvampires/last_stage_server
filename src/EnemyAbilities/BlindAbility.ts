import Func from '../Func'
import Enemy from '../Objects/src/Enemy/Enemy'
import Blind from '../Status/Blind'
import EnemyAbility from './EnemyAbility'

export default class BlindAbility extends EnemyAbility {
    cooldown: number = 18000

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

        let e = enemy.getBoxElipse()
        e.r = 15

        enemy.level.players.forEach(elem => {
            if (Func.elipseCollision(e, elem.getBoxElipse())) {
                let status = new Blind(enemy.level.time)
                status.setDuration(5000)
                enemy.level.setStatus(elem, status, true)
            }
        })
    }
}
