import Level from '../../Level'
import Effect from './Effects'

export default class ClosedGate extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'closed gate'
    }
}
