import Character from '../Objects/src/Character'
import TwilightGlovesStatus from '../Status/TwilightGlovesStatus'
import Item from './Item'

export default class TwilightGloves extends Item {
    unit: any
    frequency: number = 4000

    constructor() {
        super()
        this.name = 'twilight gloves'
        this.type = 2
        this.description = 'periodically create clots of energy on enemies'
        this.count = 1
        this.distance = 15
        this.chance = 50
    }

    getSpecialForgings(): string[] {
        return ['count', 'frequency', 'chance']
    }

    equip(character: Character): void {
        let status = new TwilightGlovesStatus(character.level.time, this)

        character.level.setStatus(character, status)
    }
}
