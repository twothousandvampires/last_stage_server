import Level from '../../Level'
import Effect from './Effects'

export default class GroundHit extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'ground hit'
    }
}
