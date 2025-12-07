import Level from '../../Level'
import Effect from './Effects'

export default class BurningCircleEffect extends Effect {
    x: any
    y: any

    constructor(level: Level) {
        super(level)
        this.name = 'burning circle'
        this.x = undefined
        this.y = undefined
    }
}
