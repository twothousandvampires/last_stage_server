import Func from '../Func'
import GoldNova from '../Objects/Effects/GoldNova'
import Enemy from '../Objects/src/Enemy/Enemy'
import EnemyAbility from './EnemyAbility'

export default class GoldNovaAbility extends EnemyAbility {
    cooldown: number = 5000

    canUse(enemy: Enemy) {
        return (
            enemy.level.time - this.last_used_time >= this.cooldown &&
            enemy.target &&
            Func.distance(enemy, enemy.target) <= 20
        )
    }

    use(enemy: Enemy) {
        this.last_used_time = enemy.level.time

        let nova = new GoldNova(enemy.level)
        nova.setPoint(enemy.x, enemy.y)

        enemy.level.addEffect(nova)

        enemy.level.players.forEach(elem => {
            if (!elem.is_dead && Func.distance(elem, enemy) <= 14) {
                elem.takeDamage()
            }
        })
    }
}
