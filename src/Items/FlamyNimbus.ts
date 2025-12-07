import Func from '../Func'
import ITrigger from '../Interfaces/ITrigger'
import FlamyRing from '../Objects/Effects/FlamyRing'
import Character from '../Objects/src/Character'
import Item from './Item'

export default class FlamyNimbus extends Item implements ITrigger {
    last_trigger_time: number = 0
    radius: number = 30

    constructor() {
        super()
        this.type = 3
        this.chance = 20
        this.cd = 4000
        this.description = 'when you get maximum energy create a ring that burn enemies'
        this.name = 'flamy nimbus'
    }

    getTriggerChance(player: Character | undefined): number {
        return this.chance
    }

    equip(character: Character): void {
        character.triggers_on_get_energy.push(this)
    }

    getSpecialForgings(): string[] {
        return ['chance']
    }

    trigger(character: Character, target: any) {
        if (this.disabled) return
        if (character.resource < character.maximum_resources) return

        let e = new FlamyRing(character.level)
        e.setPoint(character.x, character.y)

        character.level.addEffect(e)

        let enemies = character.level.enemies.filter(
            elem => !elem.is_dead && Func.distance(character, elem) <= this.radius
        )

        enemies.forEach(elem => {
            elem.takeDamage(character, {
                burn: true,
            })
        })
    }
}
