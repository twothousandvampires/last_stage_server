import Level from '../../Level'
import Effect from './Effects'

export default class UnholySpiritEffect extends Effect {
    x: any
    y: any

    constructor(level: Level) {
        super(level)
        this.name = 'unholy spirit'
        this.x = undefined
        this.y = undefined
    }
}
