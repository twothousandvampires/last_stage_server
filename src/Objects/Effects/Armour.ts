import Level from '../../Level'
import Effect from './Effects'

export default class Armour extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'armour'
    }
}
