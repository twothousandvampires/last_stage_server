import Character from '../../Objects/src/Character'
import Item from '../Item'
import Forging from './Forging'

export default class MaxLife extends Forging {

    value: number = 0

    constructor(item: Item | undefined) {
        super(item)
        this.max_value = 1
        this.name = 'life'
        this.description = 'increases miximum life'
        this.gold_cost = 0
    }

    forge(player: Character, force = false) {
        if (this.canBeForged() || force) {
            player.max_life ++
            this.value ++
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
