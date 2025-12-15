import Character from '../../Objects/src/Character'
import Item from '../Item'
import Forging from './Forging'

export default class MaxResource extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 3
        this.name = 'resourses'
        this.description = 'increases your maximum energy'
        this.gold_cost = 15
    }

    forge() {
        if (this.canBeForged() && this.costEnough()) {
            this.value++
            this.item.player.maximum_resources += 1
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
