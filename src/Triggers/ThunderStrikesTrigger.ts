import Func from '../Func'
import { Lightning } from '../Objects/Projectiles/Lightning'
import Character from '../Objects/src/Character'

export default class ThunderStrikesTrigger {
    cd: number = 1500
    last_trigger_time: number = 0
    count: number = 0
    name: string = 'thunder strikes'
    description: string = 'Creates lightning bolts that strike behind the target'
    chance: number = 100

    trigger(player: Character, enemy: any) {
        if (!enemy) return

        if (player.level.time - this.last_trigger_time < this.cd) return

        this.last_trigger_time = player.level.time

        let angle = Func.angle(player.x, player.y, enemy.x, enemy.y)

        let u = 0
        let d = 0

        for (let i = 0; i < this.count; i++) {
            let l = new Lightning(player.level)
            l.setPoint(enemy.x + Math.sin(angle) * 4, enemy.y + Math.cos(angle) * 4)

            if (i === 0) {
                l.setAngle(angle)
            } else if (i % 2 === 0) {
                u += 0.5
                l.setAngle(angle - u)
            } else {
                d += 0.5
                l.setAngle(angle + d)
            }

            player.level.projectiles.push(l)
        }
    }
}
