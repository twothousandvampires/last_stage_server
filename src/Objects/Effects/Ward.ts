import Level from '../../Level'
import Effect from './Effects'

export default class Ward extends Effect {
    x: any
    y: any

    constructor(level: Level) {
        super(level)
        this.name = 'ward'
        this.x = undefined
        this.y = undefined
    }
}
