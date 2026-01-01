import Level from '../../Level'
import Effect from './Effects'

export default class PlagueBombExplode extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'plague bomb explode'
    }
}