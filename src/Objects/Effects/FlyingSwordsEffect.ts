import Level from '../../Level'
import Effect from './Effects'

export default class FlyingSwordsEffect extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'flying swords'
    }
}
