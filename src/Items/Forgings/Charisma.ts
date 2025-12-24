import Character from '../../Objects/src/Character'
import Item from '../Item'
import Forging from './Forging'

export default class Charisma extends Forging {

    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 7
        this.name = 'charisma'
        this.description = 'increases the chance of saying something'
        this.gold_cost = 0
    }

    forge(player: Character, force = false) {
        if (this.canBeForged() || force) {
            player.chance_to_say_phrase += 7
            this.value += 7
        }
    }

    getValue() {
        return this.value
    }

    canBeForged(): boolean {
        if (!this.item || !this.item.player) return false

        return this.value < this.max_value
    }
}
