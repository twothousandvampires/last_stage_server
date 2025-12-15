import ITrigger from '../../Interfaces/Itrigger'
import Character from '../../Objects/src/Character'
import FreezeWhetHitedTrigger from '../../Triggers/FreezeWhetHitedTrigger'
import Item from '../Item'
import Forging from './Forging'

export default class FreezeWhenHited extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 35
        this.name = 'icy halo'
        this.description = 'chance to freeze enemies in radius when getting hit'
        this.gold_cost = 10
    }

    forge(player: Character) {
        if (this.canBeForged() && this.costEnough()) {
            let trigger = player.triggers_on_get_hit.find(
                elem => elem instanceof FreezeWhetHitedTrigger
            )

            if (trigger) {
                trigger.chance += 5
            } else {
                let t = new FreezeWhetHitedTrigger()
                t.chance = 5

                player.triggers_on_get_hit.push(t)
            }

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
