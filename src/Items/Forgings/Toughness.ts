import Item from '../Item'
import Forging from './Forging'

export default class Toughness extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 20
        this.name = 'toughness'
        this.description = 'increases your chance to avoid damaged state'
        this.gold_cost = 5
    }

    forge() {
        if (this.canBeForged() && this.costEnough()) {
            this.value += 2
            this.item.player.chance_to_avoid_damage_state += 2
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
