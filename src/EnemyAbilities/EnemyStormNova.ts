import Func from '../Func'
import SmallShockNova from '../Objects/Effects/SmallShockNova'
import Enemy from '../Objects/src/Enemy/Enemy'
import ShockStatus from '../Status/ShockStatus'
import EnemyAbility from './EnemyAbility'

export default class EnemyStormNova extends EnemyAbility {
    cooldown: number = 14000

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

        let effect = new SmallShockNova(enemy.level)
        effect.setPoint(enemy.x, enemy.y)

        enemy.level.effects.push(effect)

        enemy.level.players.forEach(elem => {
            if (Func.elipseCollision(e, elem.getBoxElipse())) {
                let status = new ShockStatus(enemy.level.time)
                status.setDuration(4000)
                status.setPower(25)
                enemy.level.setStatus(elem, status)
            }
        })
    }
}
