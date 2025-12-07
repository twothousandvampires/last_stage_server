import Level from '../../Level'
import Effect from './Effects'

export default class BannerOfArmourEffect extends Effect {
    x: any
    y: any

    constructor(level: Level) {
        super(level)
        this.name = 'banner of armour'
        this.x = undefined
        this.y = undefined
    }
}
