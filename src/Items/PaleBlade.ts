import Func from '../Func'
import ITrigger from '../Interfaces/Itrigger'
import Character from '../Objects/src/Character'
import SpectralSword from '../Objects/src/Summons/SpectralSword'
import Item from './Item'

export default class PaleBlade extends Item implements ITrigger {
    last_trigger_time: number = 0
    cd: number = 1000

    constructor() {
        super()
        this.name = 'pale blade'
        this.type = 1
        this.chance = 10
        this.count = 1
        this.description =
            'when you hit enemy there is a chance to summon spectral blade which will fight on you side'
        this.duration = 10000
    }

    equip(character: Character): void {
        character.triggers_on_hit.push(this)
    }

    getTriggerChance(player: Character | undefined): number {
        return this.chance
    }

    getSpecialForgings(): string[] {
        return ['chance', 'frequency', 'duration']
    }

    trigger(character: Character, target: any) {
        if (this.disabled) return

        this.last_trigger_time = character.level.time
        let summon = new SpectralSword(character.level, this.duration, character)
        summon.setPoint(character.x, character.y)

        character.level.enemies.push(summon)
    }
}
