import Level from '../../Level'
import Effect from './Effects'

export default class SingleEarthSpike extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'single earth spike'
        this.box_r = 3
    }
}