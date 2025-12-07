import Func from '../Func'
import ITrigger from '../Interfaces/Itrigger'
import Character from '../Objects/src/Character'
import Phase from '../Status/Phase'
import Item from './Item'

export default class Cloak extends Item implements ITrigger {
    cd = 0
    last_trigger_time: number = 0

    constructor() {
        super()
        this.chance = 40
        this.name = 'cloak'
        this.type = 2
        this.description = 'gives a chance to gain phasing when taking damage'
    }

    getTriggerChance(): number {
        return this.chance
    }

    equip(character: Character): void {
        character.triggers_on_get_hit.push(this)
    }

    getSpecialForgings(): string[] {
        return ['chance', 'duration']
    }

    trigger(character: Character) {
        if (this.disabled) return

        let status = new Phase(character.level.time)

        status.setDuration(3000 + this.duration)
        character.level.setStatus(character, status, true)
    }
}
