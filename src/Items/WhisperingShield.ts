import Func from '../Func'
import ITrigger from '../Interfaces/ITrigger'
import StrangeLanguage from '../Objects/Effects/StrangeLanguage'
import Character from '../Objects/src/Character'
import Item from './Item'

export default class WhisperingShield extends Item implements ITrigger {
    last_trigger_time: number = 0

    constructor() {
        super()
        this.chance = 5
        this.name = 'whispering shield'
        this.type = 2
        this.description = 'increases a chance to block and... whispers strange things sometimes'
    }

    getTriggerChance(): number {
        return this.chance
    }

    getSpecialForgings(): string[] {
        return ['chance']
    }

    equip(character: Character): void {
        character.triggers_on_block.push(this)
        character.chance_to_block += 5
    }

    trigger(character: Character) {
        if (this.disabled) return

        let phrase = new StrangeLanguage(character.level)
        phrase.z = 10
        phrase.setPoint(character.x, character.y)

        character.level.effects.push(phrase)
    }
}
