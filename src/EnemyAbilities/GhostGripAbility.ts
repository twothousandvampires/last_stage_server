import Func from '../Func'
import GhostGripArea from '../Objects/Effects/GhostGripArea'
import Enemy from '../Objects/src/Enemy/Enemy'
import GhostGrip from '../Status/GhostGrip'
import EnemyAbility from './EnemyAbility'

export default class GhostGripAbility extends EnemyAbility {
    cooldown = 20000

    canUse(enemy: Enemy) {
        return (
            enemy.level.time - this.last_used_time >= this.cooldown &&
            enemy.target &&
            Func.distance(enemy, enemy.target) <= 10
        )
    }

    use(enemy: Enemy) {
        this.last_used_time = enemy.level.time
        if (!enemy.target) return

        let ppl = enemy.level.players.filter(elem => Func.distance(elem, enemy) <= 30)

        let target = ppl[Math.floor(Math.random() * ppl.length)]

        if (target) {
            let e = new GhostGripArea(enemy.level)
            e.setPoint(target.x, target.y)
            enemy.level.effects.push(e)

            ppl = enemy.level.players.filter(elem => Func.distance(elem, target) <= 16)

            ppl.forEach(elem => {
                let status = new GhostGrip(enemy.level.time)
                status.setDuration(4000)
                enemy.level.setStatus(elem, status)
            })
        }
    }
}
