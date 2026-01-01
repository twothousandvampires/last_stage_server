import Character from '../../Objects/src/Character'
import Item from '../Item'
import Forging from './Forging'

export default class Echo extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 5
        this.name = 'echo'
        this.description = 'gives a chance that a trigger triggered twice'
        this.gold_cost = 0
    }

    forge(player: Character, force = false) {
        if (this.canBeForged() || force) {
            this.value += 5
            player.chance_to_trigger_additional_time += 5
        }
    }

    getValue() {
        return this.value + '%'
    }

    canBeForged(): boolean {
        if (!this.item || !this.item.player) return false

        return this.value < this.max_value
    }
}
