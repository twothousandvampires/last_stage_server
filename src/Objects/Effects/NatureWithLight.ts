import Level from '../../Level'
import Effect from './Effects'

export default class NatureWithLight extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'nature with light'
    }
}
