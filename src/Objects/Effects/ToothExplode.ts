import Level from '../../Level'
import Effect from './Effects'

export default class ToothExplode extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'tooth explode'
    }
}
