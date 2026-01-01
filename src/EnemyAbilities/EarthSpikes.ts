import Func from '../Func'
import EarthSpikesEffect from '../Objects/Effects/EarthSpikesEffect'
import Enemy from '../Objects/src/Enemy/Enemy'
import EnemyAbility from './EnemyAbility'

export default class EarthSpikes extends EnemyAbility {
    
    cooldown: number = 20000

    canUse(enemy: Enemy) {
        if(!enemy.target) return false

        let d = Func.distance(enemy, enemy.target)
        return (
            enemy.level.time - this.last_used_time >= this.cooldown &&
            d >= 6 &&
            d <= 25
        )
    }

    use(enemy: Enemy) {
        this.last_used_time = enemy.level.time
        if (!enemy.target) return

        let e =  new EarthSpikesEffect(enemy.level)
        e.setPoint(enemy.x, enemy.y)
        e.setOwner(enemy)

        enemy.level.binded_effects.push(e)
    }
}