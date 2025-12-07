import Level from '../../Level'
import Effect from './Effects'

export default class EnemyRemains extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'enemy remains'
    }
}
