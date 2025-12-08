import Item from '../Item'
import Forging from './Forging'

export default class BlessedLife extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 10
        this.name = 'blessed life'
        this.description = 'increases chance to regen life above maximum'
        this.gold_cost = 5
    }

    forge() {
        if (this.canBeForged() && this.costEnough()) {
            this.value += 1
            this.item.player.can_regen_more_life_chance += 1
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