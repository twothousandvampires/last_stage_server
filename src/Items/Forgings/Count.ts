import Item from '../Item'
import Forging from './Forging'

export default class Count extends Forging {
    constructor(item: Item) {
        super(item)
        this.max_value = 5
        this.name = 'count'
        this.description = 'increases count of projectiles etc'
        this.gold_cost = 10
    }

    forge() {
        if (this.canBeForged() && this.costEnough()) {
            this.item.count += 1
            this.payCost()
            this.value++
        }
    }

    getValue() {
        return this.value
    }

    canBeForged(): boolean {
        return this.item.count != undefined && this.value < this.max_value
    }
}
