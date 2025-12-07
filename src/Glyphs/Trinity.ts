import Ability from '../Abilities/Ability'
import { FireballProjectile } from '../Objects/Projectiles/FireballProjectile'
import { FrostSphereProjectile } from '../Objects/Projectiles/FrostSphereProjectile'
import { Spark } from '../Objects/Projectiles/Spark'
import Character from '../Objects/src/Character'
import Mastery from './Mastery'

export default class Trinity extends Mastery {
    constructor() {
        super()
        this.name = 'trinity'
        this.description = 'Creates frost sphere, spark and flame.'
    }

    async trigger(player: Character, ability: Ability) {
        let count = 3
        let zones = 6.28 / count

        for (let i = 0; i < count; i++) {
            let min_a = (i - 1) * zones
            let max_a = i * zones

            let angle = Math.random() * (max_a - min_a) + min_a

            let proj = undefined

            if (i === 0) {
                proj = new Spark(player.level, 6, 12000)
            } else if (i === 1) {
                proj = new FrostSphereProjectile(player.level)
                proj.icicles_count = 5
            } else if (i === 2) {
                proj = new FireballProjectile(player.level)
                proj.pierce = true
            }
            if (proj) {
                proj.setOwner(player)
                proj.setPoint(player.x, player.y)
                proj.setAngle(angle)
                player.level.projectiles.push(proj)
            }
        }
    }
}
