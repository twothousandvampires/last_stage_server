import Character from '../../Objects/src/Character'
import FrostShpereWhenKillTrigger from '../../Triggers/FrostShpereWhenKillTrigger'
import Item from '../Item'
import Forging from './Forging'

export default class FrostShpereWhenKill extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 35
        this.name = 'cold weapon'
        this.description = 'when you kill enemy where is a chance to create frost spheres'
        this.gold_cost = 10
    }

    forge(player: Character) {
        if (this.canBeForged() && this.costEnough()) {
            let trigger = player.triggers_on_kill.find(
                elem => elem instanceof FrostShpereWhenKillTrigger
            )

            if (trigger) {
                trigger.chance += 5
            } else {
                let t = new FrostShpereWhenKillTrigger()
                t.chance = 5

                player.triggers_on_kill.push(t)
            }

            this.payCost()
            this.value += 5
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
