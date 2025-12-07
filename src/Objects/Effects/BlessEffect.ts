import Level from '../../Level'
import Effect from './Effects'

export default class BlessEffect extends Effect {
    x: any
    y: any

    constructor(level: Level) {
        super(level)
        this.name = 'bless'
        this.x = undefined
        this.y = undefined
    }
}
