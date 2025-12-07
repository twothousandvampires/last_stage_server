import Level from '../../Level'
import Effect from './Effects'

export default class UnholyPowerEffect extends Effect {
    x: any
    y: any

    constructor(level: Level) {
        super(level)
        this.name = 'unholy power'
        this.x = undefined
        this.y = undefined
    }
}
