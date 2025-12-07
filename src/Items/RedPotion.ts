import Heal from '../Objects/Effects/Heal'
import Character from '../Objects/src/Character'
import Immortality from '../Status/Immortality'
import Recharge from './Forgings/Recharge'
import Item from './Item'

export default class RedPotion extends Item {
    used: boolean

    constructor() {
        super()
        this.used = false
        this.name = 'red potion'
        this.chance = 100
        this.duration = 1500
        this.type = 3
        this.forge = [new Recharge(this)]
        this.description =
            'when you reach 1 life, your life is restored to full and you gain immortality for a short period'
    }

    equip(character: Character): void {
        character.triggers_on_near_dead.push(this)
    }

    getSpecialForgings(): string[] {
        return ['duration']
    }

    trigger(character: Character) {
        if (this.disabled) return
        if (this.used) return

        let status = new Immortality(character.time)
        status.setDuration(this.duration)

        character.level.setStatus(character, status, true)

        character.addLife(3)

        character.level.addSound('potion', character.x, character.y)
        let e = new Heal(character.level)
        e.setPoint(character.x, character.y)
        e.z += 8

        character.level.effects.push(e)
        this.used = true
    }
}
