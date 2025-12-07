import Level from '../../Level'
import Effect from './Effects'

export default class BoneArmourExplosion extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'bone explosion'
    }
}
