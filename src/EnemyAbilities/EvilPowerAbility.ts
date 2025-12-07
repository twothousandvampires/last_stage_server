import Func from '../Func'
import Enemy from '../Objects/src/Enemy/Enemy'
import PileOfEvilStatus from '../Status/PileOfEvilStatus'
import EnemyAbility from './EnemyAbility'

export default class EvilPowerAbility extends EnemyAbility {
    cooldown: number = 14000

    canUse(enemy: Enemy) {
        return enemy.level.time - this.last_used_time >= this.cooldown
    }

    use(enemy: Enemy) {
        this.last_used_time = enemy.level.time

        enemy.level.sounds.push({
            name: 'dark cast',
            x: enemy.x,
            y: enemy.y,
        })

        let e = enemy.getBoxElipse()
        e.r = 15

        enemy.level.enemies.forEach(elem => {
            if (Func.elipseCollision(e, elem.getBoxElipse())) {
                let status = new PileOfEvilStatus(enemy.level.time)
                status.setDuration(4000)
                enemy.level.setStatus(elem, status)
            }
        })
    }
}
