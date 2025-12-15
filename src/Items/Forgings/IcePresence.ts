import Character from '../../Objects/src/Character'
import IcePresenceStatus from '../../Status/IcePresenceStatus'
import Item from '../Item'
import Forging from './Forging'

export default class IcePresence extends Forging {
    value: number = 20
    applyed: boolean = false

    constructor(item: Item) {
        super(item)
        this.max_value = 40
        this.name = 'ice presence'
        this.description = 'give a chance to deal damage to nearby freezed enemies'
        this.gold_cost = 10
    }

    forge(player: Character) {
        if (this.canBeForged() && this.costEnough()) {
            let status = new IcePresenceStatus(player.level.time)
            status.setPower(this.applyed ? 5 : 20)
            player.level.setStatus(player, status, true)

            if (!this.applyed) {
                this.applyed = true
            } else {
                this.value += 5
            }

            this.payCost()
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
