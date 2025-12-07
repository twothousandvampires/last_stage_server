import Func from '../Func'
import ITrigger from '../Interfaces/Itrigger'
import Gold from '../Objects/Effects/Gold'
import Character from '../Objects/src/Character'
import Unit from '../Objects/src/Unit'
import Item from './Item'

export default class RingOfTransmutation extends Item implements ITrigger {
    last_trigger_time: number = 0
    cd: number = 0

    constructor() {
        super()
        this.chance = 5
        this.name = 'ring of transmutation'
        this.type = 3
        this.description = 'when hitted by enemy there is a chance turn them into gold'
    }

    getSpecialForgings(): string[] {
        return ['chance']
    }

    getTriggerChance(): number {
        return this.chance
    }

    equip(character: Character): void {
        character.triggers_on_get_hit.push(this)
    }

    trigger(character: Character, unit: Unit | undefined) {
        if (this.disabled) return
        if (!unit) return

        if (!unit.is_dead) {
            unit.takeDamage(character, {
                instant_death: true,
            })
        }

        character.gold += 10

        character.level.addSound('gold spending', unit.x, unit.y)
        let e = new Gold(character.level)
        e.setPoint(unit.x, unit.y)
        character.level.effects.push(e)
    }
}
