import Character from '../../Objects/src/Character'
import Item from '../Item'
import Forging from './Forging'

export default class AttackSpeed extends Forging {
    value: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 200
        this.name = 'attack speed'
        this.description = 'increases your attack speed'
        this.gold_cost = 7
    }

    forge(player: Character) {
        if (this.canBeForged() && this.costEnough()) {
            this.value += 20
            this.item.player.attack_speed -= 20
            this.payCost()
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
