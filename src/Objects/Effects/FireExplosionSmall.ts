import Level from '../../Level'
import Effect from './Effects'

export default class FireExplosionSmall extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'fire_explosion_medium'
        this.light_r = 3
    }
}
