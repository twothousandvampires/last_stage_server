import ITrigger from '../Interfaces/ITrigger'
import { Lightning } from '../Objects/Projectiles/Lightning'
import Character from '../Objects/src/Character'

export default class LightningWhenUseAbilityTrigger implements ITrigger {
    cd: number = 600
    last_trigger_time: number = 0
    chance: number = 0
    name: string = 'electrification'
    description: string = 'Gives a chance to realise 3 lightnings'

    getTriggerChance(player: Character | undefined): number {
        return this.chance
    }

    trigger(player: Character) {
        let count = 3
        let zones = 6.28 / count

        for (let i = 1; i <= count; i++) {
            let min_a = (i - 1) * zones
            let max_a = i * zones

            let angle = Math.random() * (max_a - min_a) + min_a
            let proj = new Lightning(player.level)
            proj.setOwner(player)
            proj.setAngle(angle)
            proj.setPoint(player.x, player.y)

            player.level.projectiles.push(proj)
        }
    }
}
