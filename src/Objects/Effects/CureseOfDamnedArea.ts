import Level from '../../Level'
import Effect from './Effects'

export default class CureseOfDamnedArea extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'curse area'
    }
}
