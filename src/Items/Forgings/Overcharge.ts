import Character from '../../Objects/src/Character'
import ExplodeEnemyWhenGetEnergy from '../../Triggers/ExplodeEnemyWhenGetEnergy'
import Item from '../Item'
import Forging from './Forging'

export default class Overcharge extends Forging {
    value: number = 0
    trigger: any

    constructor(item: Item) {
        super(item)
        this.max_value = 35
        this.name = 'corpse explosion'
        this.description = 'gives a chance to explode nearby corpse when you get energy'
        this.gold_cost = 10
    }

    forge(player: Character) {
        if (this.canBeForged() && this.costEnough()) {
            if (this.canBeForged() && this.costEnough()) {
                if (!this.trigger) {
                    this.trigger = new ExplodeEnemyWhenGetEnergy()
                    player.triggers_on_get_energy.push(this.trigger)
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
