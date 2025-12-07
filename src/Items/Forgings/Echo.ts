import Item from '../Item'
import Forging from './Forging'

export default class Echo extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 20
        this.name = 'echo'
        this.description = 'gives a chance that a trigger triggered twice'
        this.gold_cost = 8
    }

    forge() {
        if (this.canBeForged() && this.costEnough()) {
            this.value += 2
            this.item.player.chance_to_trigger_additional_time += 2
            this.payCost()
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
