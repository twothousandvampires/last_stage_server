import Character from '../../Objects/src/Character'
import ShockNovaWhenArmourBlock from '../../Triggers/ShockNovaWhenArmourBlock'
import Item from '../Item'
import Forging from './Forging'

export default class ShockNovaWhenArmour extends Forging {
    
    value: number = 0
    freq: number = 3000
    last_trigger_time: number = 0
    trigger: any

    constructor(item: Item) {
        super(item)
        this.max_value = 80
        this.name = 'shock nova when armour'
        this.description = 'chance to shock nearby enemies when you block damage by armour'
        this.gold_cost = 12
    }

    forge(player: Character) {
        if (this.canBeForged() && this.costEnough()) {
            if (!this.trigger) {
                this.trigger = new ShockNovaWhenArmourBlock()
                player.triggers_on_armour_hit.push(this.trigger)
            }
            this.trigger.chance += 5

            this.payCost()
            this.value += 5
        }
    }

    getValue() {
        return this.value + '%'
    }

    canBeForged(): boolean {
        if (!this.item || !this.item.player) return false

        return this.value < this.max_value
    }
}
