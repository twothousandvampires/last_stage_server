import Character from '../Objects/src/Character'
import Item from './Item'

export default class EmeraldKnife extends Item {
    constructor() {
        super()
        this.name = 'emerald knife'
        this.type = 1
        this.description = 'increase a chance to get additional gold'
    }

    equip(character: Character): void {
        character.chance_to_get_additional_gold += 10
    }

    disable(): void {
        this.disabled = true
        if (this.player) {
            this.player.chance_to_get_additional_gold -= 10
        }
    }

    enable(): void {
        this.disabled = false
        if (this.player) {
            this.player.chance_to_get_additional_gold += 10
        }
    }
}
