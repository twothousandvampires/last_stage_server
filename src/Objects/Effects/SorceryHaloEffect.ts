import Level from '../../Level'
import Effect from './Effects'

export default class SorceryHaloEffect extends Effect {
    x: any
    y: any

    constructor(level: Level) {
        super(level)
        this.name = 'sorcery halo'
        this.x = undefined
        this.y = undefined
    }
}
