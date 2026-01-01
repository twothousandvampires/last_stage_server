import Func from '../Func'
import PlagueBombEffect from '../Objects/Effects/PlagueBombEffect'
import Enemy from '../Objects/src/Enemy/Enemy'
import EnemyAbility from './EnemyAbility'

export default class PlagueBomb extends EnemyAbility {
    
    cooldown = 20000
    
    canUse(enemy: Enemy) {
        return (
            enemy.level.time - this.last_used_time >= this.cooldown &&
            enemy.target &&
            Func.distance(enemy, enemy.target) >= 10
        )
    }

    use(enemy: Enemy) {
        this.last_used_time = enemy.level.time
        if (!enemy.target) return

        let e = new PlagueBombEffect(enemy.level)
        e.setPoint(enemy.target.x, enemy.target.y)
        enemy.level.binded_effects.push(e)
    }
}