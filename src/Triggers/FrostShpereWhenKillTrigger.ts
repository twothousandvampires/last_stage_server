import ITrigger from '../Interfaces/Itrigger'
import { FrostSphereProjectile } from '../Objects/Projectiles/FrostSphereProjectile'
import Character from '../Objects/src/Character'
import Unit from '../Objects/src/Unit'

export default class FrostShpereWhenKillTrigger implements ITrigger {
    cd: number = 1200
    last_trigger_time: number = 0
    chance: number = 0
    name: string = 'cold weapon'
    description: string = 'Gives a chance to create frost spheres'

    getTriggerChance(): number {
        return this.chance
    }

    trigger(player: Character, target: Unit) {
        if (!target) return

        if (target.exploded || target.burned) return

        target.freezed = true

        let count = 3
        let zones = 6.28 / count

        for (let i = 1; i <= count; i++) {
            let min_a = (i - 1) * zones
            let max_a = i * zones

            let angle = Math.random() * (max_a - min_a) + min_a
            let proj = new FrostSphereProjectile(player.level)
            proj.setOwner(player)
            proj.setAngle(angle)
            proj.setPoint(target.x, target.y)

            player.level.projectiles.push(proj)
        }
    }
}
