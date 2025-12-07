import ITrigger from '../Interfaces/Itrigger'
import { Lightning } from '../Objects/Projectiles/Lightning'
import Character from '../Objects/src/Character'
import Item from './Item'

export default class ChargedBow extends Item implements ITrigger {
    cd: number = 2000
    last_trigger_time: number = 0

    constructor() {
        super()
        this.name = 'charged bow'
        this.type = 1
        this.chance = 20
        this.count = 1
        this.description = 'after hit enemy there is a chance to create lightnings with 2000 ms cd'
    }

    getTriggerChance(): number {
        return this.chance
    }

    equip(character: Character): void {
        character.triggers_on_hit.push(this)
    }

    getSpecialForgings(): string[] {
        return ['chance', 'count']
    }

    trigger(character: Character, target: any) {
        if (this.disabled) return

        character.level.addSound('zap', target.x, target.y)

        let count = this.count

        let zones = 6.28 / count

        for (let i = 1; i <= count; i++) {
            let min_a = (i - 1) * zones
            let max_a = i * zones

            let angle = Math.random() * (max_a - min_a) + min_a
            let proj = new Lightning(character.level)
            proj.setAngle(angle)
            proj.setPoint(target.x, target.y)

            character.level.projectiles.push(proj)
        }
    }
}
