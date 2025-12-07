import Func from '../Func'
import SkullCloud from '../Objects/Effects/SkullCloud'
import Enemy from '../Objects/src/Enemy/Enemy'
import Despair from '../Status/Despair'
import EnemyAbility from './EnemyAbility'

export default class DespairAbility extends EnemyAbility {
    cooldown: number = 24000

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

        let ppl = enemy.level.players.filter(elem => Func.distance(elem, enemy) <= 20)

        let target = ppl[Math.floor(Math.random() * ppl.length)]

        if (target) {
            let e = new SkullCloud(enemy.level)
            e.setPoint(target.x, target.y)
            enemy.level.effects.push(e)

            ppl = enemy.level.players.filter(elem => Func.distance(elem, target) <= 20)

            ppl.forEach(elem => {
                let status = new Despair(elem.level.time)
                status.setDuration(6000)
                enemy.level.setStatus(elem, status)
            })
        }
    }
}
