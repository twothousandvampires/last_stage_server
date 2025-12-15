import Item from '../Item'
import Forging from './Forging'

export default class ArmourRate extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 50
        this.name = 'armour'
        this.description = 'increases your armour'
        this.gold_cost = 5
    }

    forge() {
        if (this.canBeForged() && this.costEnough()) {
            this.value ++
            this.item.player.armour_rate += 1
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
