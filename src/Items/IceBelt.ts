import Character from '../Objects/src/Character'
import Item from './Item'

export default class IceBelt extends Item {
    constructor() {
        super()
        this.name = 'ice belt'
        this.type = 2
        this.description = 'increases maximum of energy'
    }

    equip(character: Character): void {
        character.maximum_resources++
    }

    disable(): void {
        this.disabled = true
        if (this.player) {
            this.player.maximum_resources--
        }
    }

    enable(): void {
        this.disabled = false
        if (this.player) {
            this.player.maximum_resources++
        }
    }
}
