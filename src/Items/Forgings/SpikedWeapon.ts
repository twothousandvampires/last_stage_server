import Item from '../Item'
import Forging from './Forging'

export default class SpikedWeapon extends Forging {

    value: number = 0
    consumable: boolean = true

    constructor(item: Item | undefined) {
        super(item)
        this.max_value = 1
        this.name = 'spiked weapon'
        this.description = 'permanently increases you pierce rating depends of count of forgings on item, can be used only on weapons'
        this.gold_cost = 0
    }

    forge() {
        this.item.player.pierce += 5 + (this.item.forge.length * 5)
    }

    getValue() {
        return this.value
    }

    canBeForged(): boolean {
        if (!this.item || !this.item.player) return false

        return this.item.type === 1
    }
}