import ITrigger from '../../Interfaces/ITrigger'
import Character from '../../Objects/src/Character'
import Unit from '../../Objects/src/Unit'
import Fortify from '../../Status/Fortify'
import Item from '../Item'
import Forging from './Forging'

export default class FortifyWhenHit extends Forging implements ITrigger {
    value: number = 0
    cd: number = 2000
    last_trigger_time: number = 0
    chance: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 35
        this.name = 'fortify'
        this.description = 'when you get hit there is a chance to get fortify'
        this.gold_cost = 10
    }

    getTriggerChance(): number {
        return this.chance
    }

    forge(player: Character) {
        if (this.canBeForged() && this.costEnough()) {
            if (!player.triggers_on_get_hit.some(elem => elem instanceof FortifyWhenHit)) {
                player.triggers_on_get_hit.push(this)
            }

            this.payCost()
            this.value += 5
            this.chance += 5
        }
    }

    getValue() {
        return this.value + '%'
    }

    trigger(player: Character, target: Unit) {
        let s = new Fortify(player.level.time)
        s.setDuration(5000)
        s.setPower(15)

        player.level.setStatus(player, s, true)
    }

    canBeForged(): boolean {
        if (!this.item || !this.item.player) return false

        return this.value < this.max_value
    }
}
