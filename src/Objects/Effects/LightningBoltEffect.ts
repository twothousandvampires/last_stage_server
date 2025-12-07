import Level from '../../Level'
import Effect from './Effects'

export default class LightningBoltEffect extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'lightning bolt'
    }
}
