import Level from '../../Level'
import Effect from './Effects'

export default class CurseOfDamnedEffect extends Effect {
    x: any
    y: any

    constructor(level: Level) {
        super(level)
        this.name = 'curse of damned'
        this.x = undefined
        this.y = undefined
    }
}
