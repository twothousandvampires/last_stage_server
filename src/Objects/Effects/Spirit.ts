import Level from '../../Level'
import Effect from './Effects'

export default class Spirit extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'spirit'
    }
}
