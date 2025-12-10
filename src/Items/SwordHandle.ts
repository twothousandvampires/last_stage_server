import Character from '../Objects/src/Character'
import Item from './Item'

export default class SwordHandle extends Item {
    constructor() {
        super()
        this.name = 'sword handle'
        this.type = 1
        this.description = 'you are lucky'
        this.max_forgings = 0
    }

    equip(character: Character): void {
        character.is_lucky = true
    }

    disable(): void {
        this.disabled = true
        if (this.player) {
            this.player.is_lucky = false
        }
    }

    enable(): void {
        this.disabled = false
        if (this.player) {
            this.player.is_lucky = true
        }
    }
}
