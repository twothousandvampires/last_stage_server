import Level from '../../Level'
import Effect from './Effects'

export default class ShadowDrop extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'shadow drop'
    }
}
