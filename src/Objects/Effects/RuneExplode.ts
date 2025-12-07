import Level from '../../Level'
import Effect from './Effects'

export default class RuneExplode extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'rune explode'
    }
}
