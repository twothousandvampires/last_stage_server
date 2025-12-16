import Character from '../../Objects/src/Character'
import IgniteWhenHitTrigger from '../../Triggers/IgniteWhenHitTrigger'
import Item from '../Item'
import Forging from './Forging'

export default class IgniteWhenHit extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 35
        this.name = 'flaming'
        this.description = 'chance to ignite enemies in radius when hitting target'
        this.gold_cost = 10
    }

    forge(player: Character) {
        if (this.canBeForged() && this.costEnough()) {
            let trigger = player.triggers_on_hit.find(elem => elem instanceof IgniteWhenHitTrigger)

            if (trigger) {
                trigger.chance += 5
            } else {
                let t = new IgniteWhenHitTrigger()
                t.chance = 5

                player.triggers_on_hit.push(t)
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
