import Level from '../../Level'
import Effect from './Effects'

export default class ElementalEnchantedEffect extends Effect {
    x: any
    y: any

    constructor(level: Level) {
        super(level)
        this.name = 'elemental enchanted'
        this.x = undefined
        this.y = undefined
    }
}
