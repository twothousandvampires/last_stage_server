import Character from '../../Objects/src/Character'
import IciclesWhenGetLife from '../../Triggers/IciclesWhenGetLife'
import Item from '../Item'
import Forging from './Forging'

export default class ColdHeart extends Forging {
    value: number = 0
    trigger: any

    constructor(item: Item) {
        super(item)
        this.max_value = 30
        this.name = 'cold heart'
        this.description =
            'when you get life there is a chance to realise icicles amount of that depends on you life'
        this.gold_cost = 9
    }

    forge(player: Character) {
        if (this.canBeForged() && this.costEnough()) {
            if (this.canBeForged() && this.costEnough()) {
                if (!this.trigger) {
                    this.trigger = new IciclesWhenGetLife()
                    player.triggers_on_heal.push(this.trigger)
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
