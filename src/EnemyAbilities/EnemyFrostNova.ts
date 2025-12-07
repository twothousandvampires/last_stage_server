import Func from '../Func'
import FrostNova from '../Objects/Effects/FrostNova'
import Enemy from '../Objects/src/Enemy/Enemy'
import EnemyAbility from './EnemyAbility'

export default class EnemyFrostNova extends EnemyAbility {
    cooldown: number = 12000

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

        let ef = new FrostNova(enemy.level)
        ef.setPoint(enemy.x, enemy.y)

        enemy.level.effects.push(ef)

        enemy.level.players.forEach(elem => {
            if (Func.elipseCollision(e, elem.getBoxElipse())) {
                elem.setFreeze(2000)
            }
        })
    }
}
