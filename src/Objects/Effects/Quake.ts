import Level from '../../Level'
import Effect from './Effects'

export default class QuakeEffect extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'quake'
    }
}
