import Func from '../../Func'
import Level from '../../Level'
import Effect from './Effects'

export default class GoingUpBlood extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'blood'
    }

    act(time: number): void {
        this.z += Func.random(10, 20) / 50
        this.wasChanged()

        if (this.z >= 5) {
            this.delete()
        }
    }
}
