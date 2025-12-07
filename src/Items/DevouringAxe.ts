import ITrigger from '../Interfaces/Itrigger'
import Character from '../Objects/src/Character'
import Devouring from '../Status/Devouring'
import Item from './Item'

export default class DevouringAxe extends Item implements ITrigger {
    last_trigger_time: number = 0
    cd: number = 0

    constructor() {
        super()
        this.chance = 10
        this.name = 'devouring axe'
        this.type = 1
        this.description = 'give you a chance to get devouring after kill'
    }

    getTriggerChance(): number {
        return this.chance
    }

    getSpecialForgings(): string[] {
        return ['chance', 'duration']
    }

    equip(character: Character): void {
        character.triggers_on_kill.push(this)
    }

    trigger(character: Character, target = undefined) {
        if (this.disabled) return
        if (!target) return

        let s = new Devouring(character.level.time)
        s.setDuration(6000 + this.duration)

        character.level.setStatus(character, s, true)
    }
}
