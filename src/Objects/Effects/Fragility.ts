import Level from '../../Level'
import Effect from './Effects'

export default class FragilityEffect extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'fragility'
    }
}
