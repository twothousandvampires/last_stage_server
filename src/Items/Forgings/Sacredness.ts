import Item from '../Item'
import Forging from './Forging'

export default class Sacredness extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 5
        this.name = 'soul pulling'
        this.description = 'increases a chance to create sphere after enemy dead'
        this.gold_cost = 12
    }

    forge() {
        if (this.canBeForged() && this.costEnough()) {
            this.value += 1
            this.item.player.chance_to_create_grace += 1
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
