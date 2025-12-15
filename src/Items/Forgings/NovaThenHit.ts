import Func from '../../Func'
import ITrigger from '../../Interfaces/Itrigger'
import FrostNova from '../../Objects/Effects/FrostNova'
import Character from '../../Objects/src/Character'
import Unit from '../../Objects/src/Unit'
import Item from '../Item'
import Forging from './Forging'

export default class NovaThenHit extends Forging implements ITrigger {
    value: number = 0
    cd: number = 2000
    last_trigger_time: number = 0
    chance: number = 0

    constructor(item: Item) {
        super(item)
        this.max_value = 80
        this.name = 'frost nova'
        this.description = 'gives a chance to cast frost nova when hit'
        this.gold_cost = 12
    }

    getTriggerChance(player: Character | undefined): number {
        return this.chance
    }

    forge(player: Character) {
        if (this.canBeForged() && this.costEnough()) {
            if (!player.triggers_on_hit.some(elem => elem instanceof NovaThenHit)) {
                player.triggers_on_hit.push(this)
            }

            this.payCost()
            this.value += 10
            this.chance += 10
        }
    }

    getValue() {
        return this.value + '%'
    }

    trigger(player: Character, target: Unit) {
        let e = new FrostNova(player.level)
        e.setPoint(target.x, target.y)

        let targets = player.level.enemies.concat(
            player.level.players.filter(elem => elem != player)
        )
        let box = target.getBoxElipse()
        box.r = 12

        for (let i = 0; i < targets.length; i++) {
            let target = targets[i]
            if (Func.elipseCollision(box, target.getBoxElipse())) {
                target.setFreeze(2000)
            }
        }

        player.level.effects.push(e)
    }

    canBeForged(): boolean {
        if (!this.item || !this.item.player) return false

        return this.value < this.max_value
    }
}
