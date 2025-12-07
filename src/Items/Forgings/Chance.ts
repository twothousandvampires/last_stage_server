import Item from '../Item'
import Forging from './Forging'

export default class Chance extends Forging {
    constructor(item: Item) {
        super(item)
        this.name = 'chance'
        this.description = 'increases the chance of an item being triggered'
        this.gold_cost = 5
        this.max_value = 20
    }

    forge() {
        if (this.canBeForged() && this.costEnough()) {
            this.item.chance += 2
            this.value += 2
            this.payCost()
        }
    }

    canBeForged(): boolean {
        return this.item.chance != undefined && this.value < this.max_value
    }

    getValue() {
        return this.value + '%'
    }
}
