import Character from '../../Objects/src/Character'
import FirePresenceStatus from '../../Status/FirePresenceStatus'
import IcePresenceStatus from '../../Status/IcePresenceStatus'
import Item from '../Item'
import Forging from './Forging'

export default class FirePresence extends Forging {
    value: number = 20
    applyed: boolean = false

    constructor(item: Item) {
        super(item)
        this.max_value = 40
        this.name = 'fire presence'
        this.description = 'give a chance to explode nearby ignited enemy'
        this.gold_cost = 10
    }

    forge(player: Character) {
        if (this.canBeForged() && this.costEnough()) {
            let status = new FirePresenceStatus(player.level.time)
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
