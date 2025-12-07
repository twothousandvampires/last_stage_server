import Func from '../Func'
import ITrigger from '../Interfaces/ITrigger'
import Character from '../Objects/src/Character'
import Ignite from '../Status/Ignite'
import Item from './Item'

export default class MoltenHelm extends Item implements ITrigger {
    cd: number = 10000
    last_trigger_time: number = 0
    chance: number = 100

    constructor() {
        super()
        this.name = 'molten helm'
        this.type = 2
        this.description =
            'when you start blocking you ignite enemies within a radius and youself, the power of the burn depends on your armor. it has a 15-second cooldown'
    }

    getTriggerChance(): number {
        return this.chance
    }

    equip(character: Character): void {
        character.triggers_on_start_block.push(this)
    }

    trigger(character: Character) {
        if (this.disabled) return

        let s = new Ignite(character.level.time)
        s.setDuration(4000)
        s.setPower(Math.floor(character.armour_rate / 2))
        s.provider = this

        character.level.setStatus(character, s, true)

        character.level.addSound('fire cast', character.x, character.y)

        let box = character.getBoxElipse()
        box.r = 12
        character.level.enemies.forEach(elem => {
            if (!elem.is_dead && Func.elipseCollision(box, elem.getBoxElipse())) {
                let s = new Ignite(character.level.time)

                s.setDuration(6000)
                s.setPower(character.armour_rate)
                s.provider = character

                character.level.setStatus(elem, s)
            }
        })
    }
}
