import Level from '../../Level'
import Effect from './Effects'

export default class Devour extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'devour'
    }
}
