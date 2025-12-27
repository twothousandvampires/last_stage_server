import Character from '../../Objects/src/Character'
import Item from '../Item'
import Forging from './Forging'

export default class StoneSkin extends Forging {

    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 10
        this.name = 'stone skin'
        this.description = 'increases the chance of avoiding damage'
        this.gold_cost = 0
    }

    forge(player: Character, force = false) {
        if (this.canBeForged() || force) {
            player.avoid_damage_chance += 5
            this.value += 5
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