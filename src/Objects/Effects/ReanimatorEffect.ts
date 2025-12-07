import Level from '../../Level'
import Effect from './Effects'

export default class ReanimatorEffect extends Effect {
    x: any
    y: any

    constructor(level: Level) {
        super(level)
        this.name = 'reanimator'
        this.x = undefined
        this.y = undefined
    }
}
