import Level from '../../Level'
import Effect from './Effects'

export default class EarthShaking extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'earth shaking'
    }
}
