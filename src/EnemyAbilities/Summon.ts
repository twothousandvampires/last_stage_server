import Enemy from '../Objects/src/Enemy/Enemy'
import EnemyAbility from './EnemyAbility'

export default class Summon extends EnemyAbility {
    cooldown: number = 18000

    canUse(enemy: Enemy) {
        return enemy.level.time - this.last_used_time >= this.cooldown && enemy.target
    }

    use(enemy: Enemy) {
        this.last_used_time = enemy.level.time
        if (!enemy.target) return

        enemy.level.sounds.push({
            name: 'cast',
            x: enemy.x,
            y: enemy.y,
        })

        let list = ['impy', 'flamy']

        enemy.level.script.createRandomEnemy(enemy.level, list)
    }
}
