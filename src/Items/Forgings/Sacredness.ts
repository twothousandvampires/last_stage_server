import Item from '../Item'
import Forging from './Forging'

export default class Sacredness extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 10
        this.name = 'sacredness'
        this.description = 'increases your chance to get grace after killing enemy'
        this.gold_cost = 8
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
