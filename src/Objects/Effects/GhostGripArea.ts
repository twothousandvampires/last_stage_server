import Level from '../../Level'
import Effect from './Effects'

export default class GhostGripArea extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'ghost grip area'
    }
}
