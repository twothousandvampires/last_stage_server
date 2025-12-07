import Func from '../Func'
import Soul from '../Objects/Effects/Soul'
import Enemy from '../Objects/src/Enemy/Enemy'
import EnemyAbility from './EnemyAbility'

export default class UnholyTouch extends EnemyAbility {
    cooldown: number = 16000

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

        let box = enemy.getBoxElipse()
        box.r = 12

        enemy.level.players.forEach(elem => {
            if (Func.elipseCollision(box, elem.getBoxElipse())) {
                if (elem.grace > 0) {
                    elem.grace--
                    let e = new Soul(enemy.level)
                    e.setPoint(elem.x, elem.y)
                    enemy.level.effects.push(e)
                }
            }
        })
    }
}
