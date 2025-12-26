import Character from '../../Objects/src/Character'
import AcsensionArmourTrigger from '../../Triggers/AcsensionArmourTrigger'
import Item from '../Item'
import Forging from './Forging'

export default class AscensionArmour extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 50
        this.name = 'ascension armour'
        this.description = 'When you block damage by armour there is a chance to create helm of ascending'
        this.gold_cost = 8
    }

    forge(player: Character) {
        if (this.canBeForged() && this.costEnough()) {
            let trigger = player.triggers_on_armour_hit.find( elem => elem instanceof AcsensionArmourTrigger)

            if (trigger) {
                trigger.chance += 10
            } else {
                let t = new AcsensionArmourTrigger()
                t.chance = 10

                player.triggers_on_armour_hit.push(t)
            }

            this.payCost()
            this.value += 10
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