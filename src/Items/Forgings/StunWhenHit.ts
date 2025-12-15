import Func from '../../Func'
import ITrigger from '../../Interfaces/Itrigger'
import QuakeEffect from '../../Objects/Effects/Quake'
import Character from '../../Objects/src/Character'
import Unit from '../../Objects/src/Unit'
import Item from '../Item'
import Forging from './Forging'

export default class StunWhenHit extends Forging implements ITrigger {
    value: number = 0
    cd: number = 3000
    last_trigger_time: number = 0
    chance: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 80
        this.name = 'stun when hit'
        this.description = 'gives chance to stun in radius when you hit enemy'
        this.gold_cost = 12
    }

    getTriggerChance(player: Character | undefined): number {
        return this.chance
    }

    forge(player: Character) {
        if (this.canBeForged() && this.costEnough()) {
            let exist = player.triggers_on_hit.find(elem => elem instanceof StunWhenHit)
            if (exist) {
                exist.chance += 10
                this.value += 10
            } else {
                player.triggers_on_hit.push(this)
                this.value += 10
                this.chance += 10
            }

            this.payCost()
        }
    }

    getValue() {
        return this.chance + '%'
    }

    trigger(player: Character, target: Unit) {
        let box = target.getBoxElipse()
        box.r = 8

        let effect = new QuakeEffect(player.level)
        effect.setPoint(target.x, target.y)

        player.level.effects.push(effect)

        let targets = player.level.enemies
            .concat(player.level.players.filter(elem => elem != player))
            .filter(elem => !elem.is_dead && Func.elipseCollision(elem.getBoxElipse(), box))

        for (let i = 0; i < targets.length; i++) {
            let target = targets[i]

            target.setStun(3000)
        }
    }

    canBeForged(): boolean {
        if (!this.item || !this.item.player) return false

        return this.value < this.max_value
    }
}
