import Level from '../../Level'
import Effect from './Effects'

export default class NatureNoLight extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'nature no light'
    }
}
