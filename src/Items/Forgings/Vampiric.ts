import Item from '../Item'
import Forging from './Forging'

export default class Vampiric extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 15
        this.name = 'vampiric'
        this.description = 'increases your vampiric rate'
        this.gold_cost = 10
    }

    forge() {
        if (this.canBeForged() && this.costEnough()) {
            this.value += 1
            this.item.player.vampiric_rate += 1
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
