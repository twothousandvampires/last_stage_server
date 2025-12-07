import Level from '../../Level'
import Effect from './Effects'

export default class FireExplosion extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'fire_explosion'
        this.light_r = 6
    }
}
