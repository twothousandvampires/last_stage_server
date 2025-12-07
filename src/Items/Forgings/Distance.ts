import Item from '../Item'
import Forging from './Forging'

export default class Distance extends Forging {
    constructor(item: Item) {
        super(item)
        this.max_value = 10
        this.name = 'distance'
        this.description = 'increases distance for searching targets for trigger'
        this.gold_cost = 3
    }

    forge() {
        if (this.canBeForged() && this.costEnough()) {
            this.value += 2
            this.item.distance += 2
            this.payCost()
        }
    }

    canBeForged(): boolean {
        return this.item.distance != undefined && this.value < this.max_value
    }
}
