import Func from '../../Func'
import Level from '../../Level'
import Effect from './Effects'

export default class GoingUpStar extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'star'
    }

    act(time: number): void {
        this.z += Func.random(10, 20) / 50
        this.wasChanged()

        if (this.z >= 10) {
            this.delete()
        }
    }
}
