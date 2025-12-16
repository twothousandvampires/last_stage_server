import Character from '../../Objects/src/Character'
import Item from '../Item'
import Forging from './Forging'

export default class Durability extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 10
        this.name = 'durability'
        this.description = 'increases your durability'
        this.gold_cost = 6
    }

    forge(player: Character) {
        if (this.canBeForged() && this.costEnough()) {
            this.value += 1
            this.item.player.durability += 1
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
