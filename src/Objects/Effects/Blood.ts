import Level from '../../Level'
import Effect from './Effects'

export default class Blood extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'blood'
    }
}
