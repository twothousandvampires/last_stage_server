import Character from '../Objects/src/Character'
import Item from './Item'

export default class SoulAccumulator extends Item {
    constructor() {
        super()
        this.count = 5
        this.name = 'soul accumulator'
        this.type = 3
        this.description = 'when your teammate dies, you gain 5 to all stats'
    }

    getSpecialForgings(): string[] {
        return ['count']
    }

    equip(character: Character): void {
        character.triggers_on_player_dead.push(this)
    }

    trigger(character: Character) {
        if (this.disabled) return
        if (!character.life_status) return

        character.might += this.count
        character.perception += this.count
        character.knowledge += this.count
        character.agility += this.count
        character.will += this.count
        character.durability += this.count
    }
}
