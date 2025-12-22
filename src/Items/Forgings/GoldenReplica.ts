import Item from '../Item'
import Forging from './Forging'

export default class GoldenReplica extends Forging {

    value: number = 0
    consumable: boolean = true

    constructor(item: Item | undefined) {
        super(item)
        this.max_value = 1
        this.name = 'golden replica'
        this.description = 'adds gold, the amount depends on the number of forged elements on the item, can only be used on accessories./'
        this.gold_cost = 0
    }

    forge() {
        this.item.player.gold += 5 + (this.item.forge.length * 5)
    }

    getValue() {
        return this.value
    }

    canBeForged(): boolean {
        if (!this.item || !this.item.player) return false

        return this.item.type === 3
    }
}