import Func from '../Func'
import FrostNova from '../Objects/Effects/FrostNova'
import Enemy from '../Objects/src/Enemy/Enemy'
import EnemyAbility from './EnemyAbility'

export default class ColdSpireFrostNova extends EnemyAbility {
    cooldown: number = 2000

    canUse(enemy: Enemy) {
        return true
    }

    use(enemy: Enemy) {
        this.last_used_time = enemy.level.time

        let e = enemy.getBoxElipse()
        e.r = 12

        let ef = new FrostNova(enemy.level)
        ef.setPoint(enemy.x, enemy.y)

        enemy.level.effects.push(ef)

        enemy.level.enemies.forEach(elem => {
            if (Func.elipseCollision(e, elem.getBoxElipse())) {
                elem.setFreeze(2000)
            }
        })
    }
}
