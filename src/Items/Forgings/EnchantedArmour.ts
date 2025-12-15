import Character from '../../Objects/src/Character'
import WardWhenArmourBlock from '../../Triggers/WardWhenArmourBlock'
import Item from '../Item'
import Forging from './Forging'

export default class EnchantedArmour extends Forging {
    value: number = 0
    trigger: any

    constructor(item: Item) {
        super(item)
        this.max_value = 35
        this.name = 'enchanted armour'
        this.description = 'give a chance to get ward when you block hit by armour'
        this.gold_cost = 8
    }

    forge(player: Character) {
        if (this.canBeForged() && this.costEnough()) {
            if (this.canBeForged() && this.costEnough()) {
                if (!this.trigger) {
                    this.trigger = new WardWhenArmourBlock()
                    player.triggers_on_armour_hit.push(this.trigger)
                }
                this.trigger.chance += 5

                this.payCost()
                this.value += 5
            }
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