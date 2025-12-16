import Item from '../Item'
import Forging from './Forging'

export default class Penetrating extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 20
        this.name = 'crushing'
        this.description = 'increases your crushing rating'
        this.gold_cost = 5
    }

    forge() {
        if (this.canBeForged() && this.costEnough()) {
            this.value++
            this.item.player.crushing_rating += 1
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
