import Character from '../../Objects/src/Character'
import CrystilizingHits from '../../Triggers/CrystilizingHits'
import FrostShpereWhenKillTrigger from '../../Triggers/FrostShpereWhenKillTrigger'
import Item from '../Item'
import Forging from './Forging'

export default class FragilityOnHit extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 35
        this.name = 'crystilizing hits'
        this.description = 'provides a chance to inflict fragility on enemies in a small radius on hit'
        this.gold_cost = 10
    }

    forge(player: Character) {
        if (this.canBeForged() && this.costEnough()) {

            let trigger = player.triggers_on_hit.find(
                elem => elem instanceof CrystilizingHits
            )

            if (trigger) {
                trigger.chance += 5
            } else {
                let t = new CrystilizingHits()
                t.chance = 5

                player.triggers_on_hit.push(t)
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