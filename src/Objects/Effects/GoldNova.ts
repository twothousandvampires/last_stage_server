import Level from '../../Level'
import Effect from './Effects'

export default class GoldNova extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'gold nova'
    }
}
