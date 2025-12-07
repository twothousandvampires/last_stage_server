import Func from '../Func'
import ITrigger from '../Interfaces/ITrigger'
import { Spark } from '../Objects/Projectiles/Spark'
import Character from '../Objects/src/Character'
import Unit from '../Objects/src/Unit'

export default class SparksWhenBlockTrigger implements ITrigger {
    cd: number = 1200
    last_trigger_time: number = 0
    chance: number = 0
    name: string = 'charged shield'
    description: string = 'Gives a chance to release sparks when block'

    getTriggerChance(): number {
        return this.chance
    }

    trigger(player: Character, target: Unit) {
        let count = 3
        let zones = 6.28 / count

        for (let i = 1; i <= count; i++) {
            let min_a = (i - 1) * zones
            let max_a = i * zones

            let angle = Math.random() * (max_a - min_a) + min_a
            let proj = new Spark(player.level)
            proj.setOwner(player)
            proj.setAngle(angle)
            proj.setPoint(player.x, player.y)

            player.level.projectiles.push(proj)
        }
    }
}
