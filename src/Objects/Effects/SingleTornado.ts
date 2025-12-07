import Level from '../../Level'
import Effect from './Effects'

export default class SingleTornado extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'single tornado'
    }
}
