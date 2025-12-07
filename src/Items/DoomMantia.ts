import Func from '../Func'
import Character from '../Objects/src/Character'
import Item from './Item'

export default class DoomMantia extends Item {
    constructor() {
        super()
        this.chance = 20
        this.max_chance = 50
        this.distance = 20
        this.name = 'doom mantia'
        this.type = 3
        this.description =
            'when you take lethal damage, there is a chance to redirect your death to a nearby target'
    }

    equip(character: Character): void {
        character.triggers_on_lethal_damage.push(this)
    }

    getSpecialForgings(): string[] {
        return ['chance', 'distance']
    }

    trigger(character: Character) {
        if (this.disabled) return

        if (Func.chance(this.chance)) {
            let targets = character.level.enemies.concat(
                character.level.players.filter(elem => elem != character)
            )
            targets = targets.filter(elem => Func.distance(elem, character) <= this.distance)

            let target = targets[Math.floor(Math.random() * targets.length)]

            if (target) {
                target.takeDamage(character, {
                    instant_death: true,
                })
                character.can_be_lethaled = false
            }
        }
    }
}
