import Func from '../../Func'
import ITrigger from '../../Interfaces/ITrigger'
import { Bone } from '../../Objects/Projectiles/Bone'
import Character from '../../Objects/src/Character'
import Unit from '../../Objects/src/Unit'
import Item from '../Item'
import Forging from './Forging'

export default class BonesWhenBlock extends Forging implements ITrigger {
    value: number = 0
    last_trigger_time: number = 0
    chance: number = 10
    cd: number = 1000

    constructor(item: Item) {
        super(item)
        this.max_value = 80
        this.name = 'bones when block'
        this.description = 'gives a chance to realise bones when you block which hurts enemies'
        this.gold_cost = 20
    }

    getTriggerChance(): number {
        return this.chance
    }

    forge(player: Character) {
        if (this.canBeForged() && this.costEnough()) {
            if (!player.triggers_on_block.some(elem => elem instanceof BonesWhenBlock)) {
                player.triggers_on_block.push(this)
            }

            this.payCost()
            this.value += 10
            this.chance += 10
        }
    }

    getValue() {
        return this.value
    }

    trigger(player: Character, target: Unit) {
        if (this.item.disabled) return

        let angle = Func.angle(player.x, player.y, player.y, target.y)

        let proj = new Bone(player.level)
        proj.setAngle(angle - 0.4)
        proj.setPoint(player.x, player.y)
        proj.setOwner(player)

        player.level.projectiles.push(proj)

        let proj2 = new Bone(player.level)
        proj2.setAngle(angle)
        proj2.setPoint(player.x, player.y)
        proj2.setOwner(player)

        player.level.projectiles.push(proj2)

        let proj3 = new Bone(player.level)
        proj3.setAngle(angle + 0.4)
        proj3.setPoint(player.x, player.y)
        proj3.setOwner(player)

        player.level.projectiles.push(proj3)
    }

    canBeForged(): boolean {
        if (!this.item || !this.item.player) return false

        return this.value < this.max_value
    }
}
