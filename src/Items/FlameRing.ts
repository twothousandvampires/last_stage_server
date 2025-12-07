import Func from '../Func'
import ITrigger from '../Interfaces/Itrigger'
import Character from '../Objects/src/Character'
import Item from './Item'

export default class FlameRing extends Item implements ITrigger {
    cd: number = 0
    last_trigger_time: number = 0

    constructor() {
        super()
        this.chance = 40
        this.distance = 15
        this.name = 'flame ring'
        this.type = 3
        this.count = 1
        this.description = 'when you take damage, the nearest enemy takes damage'
    }

    getTriggerChance(): number {
        return this.chance
    }

    getSpecialForgings(): string[] {
        return ['chance', 'distance', 'count']
    }

    equip(character: Character): void {
        character.triggers_on_get_hit.push(this)
    }

    trigger(character: Character) {
        if (this.disabled) return

        let targets = character.level.enemies.concat(
            character.level.players.filter(elem => elem != character)
        )
        targets = targets.filter(elem => Func.distance(elem, character) <= this.distance)

        for (let i = 0; i < this.count; i++) {
            let target = targets[Math.floor(Math.random() * targets.length)]

            if (target && !target.is_dead) {
                target.takeDamage(character, {
                    burn: true,
                })
            }
        }
    }
}
