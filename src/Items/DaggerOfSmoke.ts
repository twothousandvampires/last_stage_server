
import ITrigger from '../Interfaces/Itrigger'
import { SmokeDaggerShard } from '../Objects/Projectiles/SmokeDaggerShard'
import Character from '../Objects/src/Character'
import Item from './Item'

export default class DaggerOfSmoke extends Item implements ITrigger {
    last_trigger_time: number = 0
    constructor() {
        super()
        this.chance = 50
        this.name = 'dagger of smoke'
        this.type = 1
        this.count = 3
        this.description = 'when you heal, there is a chance to create blood shards'
    }

    getTriggerChance(player: Character | undefined): number {
        return this.chance
    }

    equip(character: Character): void {
        character.triggers_on_heal.push(this)
    }

    getSpecialForgings(): string[] {
        return ['chance', 'count']
    }

    trigger(character: Character) {
        if (this.disabled) return

        character.level.addSound('blood', character.x, character.y)

        let count = this.count

        let zones = 6.28 / count

        for (let i = 1; i <= count; i++) {
            let min_a = (i - 1) * zones
            let max_a = i * zones

            let angle = Math.random() * (max_a - min_a) + min_a
            let proj = new SmokeDaggerShard(character.level)
            proj.setAngle(angle)
            proj.setPoint(character.x, character.y)
            proj.setOwner(character)

            character.level.projectiles.push(proj)
        }
    }
}
