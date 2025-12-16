import Item from '../Item'
import Forging from './Forging'

export default class Critical extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 15
        this.name = 'critical'
        this.description = 'increases your chance to deal double damage'
        this.gold_cost = 5
    }

    forge() {
        if (this.canBeForged() && this.costEnough()) {
            this.value++
            this.item.player.critical += 1
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
