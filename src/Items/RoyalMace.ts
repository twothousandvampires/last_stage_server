import Character from '../Objects/src/Character'
import Item from './Item'

export default class RoyalMace extends Item {
    constructor() {
        super()
        this.name = 'royal mace'
        this.type = 1
        this.description = 'increases impact, crush and critical rating by 7'
    }

    equip(character: Character): void {
        character.impact += 7
        character.crushing_rating += 7
        character.critical += 7
    }

    disable(): void {
        this.disabled = true
        if (this.player) {
            this.player.impact -= 7
            this.player.crushing_rating -= 7
            this.player.critical -= 7
        }
    }

    enable(): void {
        this.disabled = false
        if (this.player) {
            this.player.impact += 7
            this.player.crushing_rating += 7
            this.player.critical += 7
        }
    }
}
