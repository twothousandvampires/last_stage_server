import ITrigger from '../Interfaces/ITrigger'
import { Icicle } from '../Objects/Projectiles/Icicle'
import Character from '../Objects/src/Character'

export default class IciclesWhenGetLife implements ITrigger {
    cd: number = 1500
    last_trigger_time: number = 0
    chance: number = 0
    name: string = 'cold heart'
    description: string = 'Creates icicles equal in number to your life'

    getTriggerChance(player: Character | undefined): number {
        return this.chance
    }

    trigger(player: Character) {
        let count = player.life_status

        let zones = 6.28 / count

        for (let i = 1; i <= count; i++) {
            let min_a = (i - 1) * zones
            let max_a = i * zones

            let angle = Math.random() * (max_a - min_a) + min_a
            let proj = new Icicle(player.level)
            proj.setAngle(angle)
            proj.setPoint(player.x, player.y)
            proj.setOwner(player)

            player.level.projectiles.push(proj)
        }
    }
}
