import Character from '../Objects/src/Character'
import Fragility from '../Status/Fragility'
import Precision from '../Status/Precision'
import Item from './Item'

export default class GlassSword extends Item {
    constructor() {
        super()
        this.name = 'glass sword'
        this.type = 1
        this.description = 'always deal double damage, always take double damage'
    }

    equip(character: Character): void {
        let f_status = new Fragility(0)
        let p_status = new Precision(0)

        f_status.need_to_check_resist = false

        character.level.setStatus(character, f_status)
        character.level.setStatus(character, p_status)
    }
}
