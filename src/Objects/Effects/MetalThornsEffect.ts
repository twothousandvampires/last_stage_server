import Level from '../../Level'
import Effect from './Effects'

export default class MetalThornsEffect extends Effect {
    x: any
    y: any

    constructor(level: Level) {
        super(level)
        this.name = 'metal thorns'
        this.x = undefined
        this.y = undefined
    }
}
