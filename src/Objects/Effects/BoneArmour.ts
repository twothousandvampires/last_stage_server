import Level from '../../Level'
import Effect from './Effects'

export default class BoneArmour extends Effect {
    x: any
    y: any

    constructor(level: Level) {
        super(level)
        this.name = 'bone armour'
    }
}
