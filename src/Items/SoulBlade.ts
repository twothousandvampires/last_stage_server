import ITrigger from '../Interfaces/ITrigger'
import Soul from '../Objects/Effects/Soul'
import Character from '../Objects/src/Character'
import Enemy from '../Objects/src/Enemy/Enemy'
import Item from './Item'

export default class SoulBlade extends Item implements ITrigger {

    cd: number = 4000
    last_trigger_time: number = 0
    chance: number = 2
    max_chance: number = 5

    constructor() {
        super()
        this.name = 'soul blade'
        this.type = 1
        this.description = 'when you kill enemy there is a chance to get ward'
    }

    getTriggerChance(): number {
        return this.chance
    }

    getSpecialForgings(): string[] {
        return ['frequency']
    }

    equip(character: Character): void {
        character.triggers_on_kill.push(this)
    }

    trigger(player: Character, enemy: Enemy) {
        if (this.disabled) return

        let e = new Soul(player.level)
        e.setPoint(enemy.x, enemy.y)
        player.level.effects.push(e)

        player.addWard(1)
    }
}
