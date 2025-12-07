import Level from '../../Level'
import Effect from './Effects'

export default class Heal extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'heal'
    }
}
