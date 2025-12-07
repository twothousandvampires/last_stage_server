import Item from '../Item'
import Forging from './Forging'

export default class CooldownReduction extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 20
        this.name = 'cooldown reduction'
        this.description = 'reduces your cooldowns'
        this.gold_cost = 8
    }

    forge() {
        if (this.canBeForged() && this.costEnough()) {
            this.value += 2
            this.item.player.cooldown_redaction += 2
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
