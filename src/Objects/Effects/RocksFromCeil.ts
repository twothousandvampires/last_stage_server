import Level from '../../Level'
import Effect from './Effects'

export default class RocksFromCeil extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'rocks from ceil'
    }
}
