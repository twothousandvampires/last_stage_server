import Item from '../Item'
import Forging from './Forging'

export default class Power extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 15
        this.name = 'power'
        this.description = 'increases your power'
        this.gold_cost = 8
    }

    forge() {
        if (this.canBeForged() && this.costEnough()) {
            this.value += 1
            this.item.player.power += 1
            this.payCost()
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
