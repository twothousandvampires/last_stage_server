import Item from '../Item'
import Forging from './Forging'

export default class Will extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 5
        this.name = 'will'
        this.description = 'increases your will'
        this.gold_cost = 5
    }

    forge() {
        if (this.canBeForged() && this.costEnough()) {
            this.value += 1
            this.item.player.will += 1
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
