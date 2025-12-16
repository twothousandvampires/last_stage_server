import Item from '../Item'
import Forging from './Forging'

export default class Pierce extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 50
        this.name = 'pierce'
        this.description = 'provides you a chance to ignore enemy armour'
        this.gold_cost = 5
    }

    forge() {
        if (this.canBeForged() && this.costEnough()) {
            this.value++
            this.item.player.pierce += 1
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
