import Item from '../Item'
import Forging from './Forging'

export default class Regen extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 1200
        this.name = 'regeneration'
        this.description = 'increase your life regeneration rate'
        this.gold_cost = 8
    }

    forge() {
        if (this.canBeForged() && this.costEnough()) {
            this.value += 200
            this.item.player.base_regeneration_time -= 200
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
