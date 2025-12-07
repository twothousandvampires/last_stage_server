import Character from '../../Objects/src/Character'
import Item from '../Item'
import Forging from './Forging'

export default class CastSpeed extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 200
        this.name = 'cast speed'
        this.description = 'increases your cast speed'
        this.gold_cost = 6
    }

    forge(player: Character) {
        if (this.canBeForged() && this.costEnough()) {
            this.value += 20
            this.item.player.cast_speed -= 20
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
