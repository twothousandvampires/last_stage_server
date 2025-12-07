import Ability from '../Abilities/Ability'
import Func from '../Func'
import { Spark } from '../Objects/Projectiles/Spark'
import Character from '../Objects/src/Character'
import Mastery from './Mastery'

export default class LightningFury extends Mastery {
    constructor() {
        super()
        this.name = 'lightning fury'
        this.description =
            'When the ability is activated, there is a chance to explode nearby enemy and create a lot of sparks.'
    }

    trigger(player: Character, ability: Ability) {
        let f = player.level.enemies.filter(
            elem => !elem.is_dead && Func.distance(player, elem) <= 8
        )[0]

        if (f) {
            f.takeDamage(player, {
                instant_death: true,
                explode: true,
            })

            let count = 8

            let zones = 6.28 / count

            for (let i = 1; i <= count; i++) {
                let min_a = (i - 1) * zones
                let max_a = i * zones

                let angle = Math.random() * (max_a - min_a) + min_a
                let proj = new Spark(player.level)

                proj.setAngle(angle)
                proj.setOwner(player)
                proj.setPoint(f.x, f.y)

                player.level.projectiles.push(proj)
            }
        }
    }
}
