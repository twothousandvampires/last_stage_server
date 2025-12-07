import Character from '../Objects/src/Character'
import Item from './Item'

export default class Distorter extends Item {
    constructor() {
        super()
        this.name = 'distorter'
        this.type = 3
        this.description = 'Gives 5% chance that a trigger triggered twice'
    }

    equip(character: Character): void {
        character.chance_to_trigger_additional_time += 5
    }

    disable(): void {
        this.disabled = true
        if (this.player) {
            this.player.chance_to_trigger_additional_time -= 5
        }
    }

    enable(): void {
        this.disabled = false
        if (this.player) {
            this.player.chance_to_trigger_additional_time += 5
        }
    }
}
