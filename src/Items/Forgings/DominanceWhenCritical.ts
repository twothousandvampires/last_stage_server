import Func from '../../Func'
import ITrigger from '../../Interfaces/Itrigger'
import Character from '../../Objects/src/Character'
import Unit from '../../Objects/src/Unit'
import Dominance from '../../Status/Dominance'
import Item from '../Item'
import Forging from './Forging'

export default class DominanceWhenCritical extends Forging implements ITrigger{

    value: number = 0
    cd: number = 3000
    last_trigger_time: number = 0
    chance: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 30
        this.name = 'dominance'
        this.description = 'when you lead critical strike there is a chance to get dominance (+30 power)'
        this.gold_cost = 10
    }

    getTriggerChance(player: Character | undefined): number {
        return this.chance
    }

    forge(player: Character) {
        if (this.canBeForged() && this.costEnough()) {
            let exist = player.triggers_on_critical.find(
                elem => elem instanceof DominanceWhenCritical
            )
            if (exist) {
                exist.chance += 5
                this.value += 5
            } else {
                player.triggers_on_critical.push(this)
                this.value += 5
                this.chance += 5
            }

            this.payCost()
        }
    }

    getValue() {
        return this.value
    }

    trigger(player: Character, target: Unit) {
        let s = new Dominance(player.level.time)
        s.setDuration(5000)

        player.level.setStatus(player, s, true)
    }

    canBeForged(): boolean {
        if (!this.item || !this.item.player) return false

        return this.value < this.max_value
    }
}
