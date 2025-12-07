import Ability from '../Abilities/Ability'
import Func from '../Func'
import ToothExplode from '../Objects/Effects/ToothExplode'
import Character from '../Objects/src/Character'
import Undead from '../Objects/src/Enemy/Undead'
import Mastery from './Mastery'

export default class HolyStrike extends Mastery {
    constructor() {
        super()
        this.name = 'holy strike'
        this.description =
            'When the ability is activated, there is a chance to deal damage to undead in medium radius.'
    }

    trigger(player: Character, ability: Ability) {
        let x = player.x
        let y = player.y
        let distance = 15
        let count = 18

        let zones = 6.28 / count

        for (let i = 1; i <= count; i++) {
            let min_a = (i - 1) * zones
            let angle = min_a

            let l = 1 - Math.abs(0.5 * Math.cos(angle))

            let e = new ToothExplode(player.level)
            e.x = x + Math.sin(angle) * distance * l
            e.y = y + Math.cos(angle) * distance * l

            player.level.addEffect(e)
        }

        player.level.enemies.forEach(elem => {
            if (!elem.is_dead && elem instanceof Undead && Func.distance(player, elem) <= 15) {
                elem.takeDamage(player, {})
            }
        })
    }
}
