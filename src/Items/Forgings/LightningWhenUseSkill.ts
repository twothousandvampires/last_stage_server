import Character from '../../Objects/src/Character'
import LightningWhenUseAbilityTrigger from '../../Triggers/LightningWhenUseAbilityTrigger'
import Item from '../Item'
import Forging from './Forging'

export default class LightningWhenUseSkill extends Forging {
    value: number = 0
    trigger: any = undefined

    constructor(item: Item) {
        super(item)
        this.max_value = 35
        this.name = 'electrification'
        this.description = 'gives a chance to realise lightnings when use skill'
        this.gold_cost = 10
    }

    forge(player: Character) {
        if (this.canBeForged() && this.costEnough()) {
            if (!this.trigger) {
                this.trigger = new LightningWhenUseAbilityTrigger()
                player.triggers_on_use_not_utility.push(this.trigger)
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
