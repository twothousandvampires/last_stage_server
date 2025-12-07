import Item from '../Item'
import Forging from './Forging'

export default class Duration extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.name = 'duration'
        this.description = 'increases duration of item effects'
        this.gold_cost = 8
        this.max_value = 1500
    }

    forge() {
        if (this.canBeForged() && this.costEnough()) {
            this.value += 250
            this.item.duration += 250
            this.payCost()
        }
    }

    getValue() {
        return this.value + 'ms'
    }

    canBeForged(): boolean {
        return this.item.duration != undefined && this.value < this.max_value
    }
}
