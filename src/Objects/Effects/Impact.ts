import Level from '../../Level'
import Effect from './Effects'

export default class Impact extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'impact'
    }
}
