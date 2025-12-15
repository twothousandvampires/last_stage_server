import Character from '../../Objects/src/Character'
import Item from '../Item'
import Forging from './Forging'

export default class Resist extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 15
        this.name = 'resist'
        this.description = 'increases your status resistance'
        this.gold_cost = 5
    }

    forge() {
        if (this.canBeForged() && this.costEnough()) {
            this.value += 1
            this.item.player.status_resistance += 1
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
