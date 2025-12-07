import Func from '../../Func'
import Level from '../../Level'
import Effect from './Effects'

export default class Torch extends Effect {
    last: number = 0
    constructor(level: Level) {
        super(level)
        this.name = 'torch'
        this.light_r = 8
    }

    act(time: number): void {
        if (time - this.last > 150) {
            this.last = time

            if (Func.chance(50)) {
                if (Func.chance(50)) {
                    this.light_r--
                    if (this.light_r < 6) {
                        this.light_r = 6
                    }
                } else {
                    this.light_r++
                    if (this.light_r > 10) this.light_r = 10
                }
            }

            this.wasChanged()
        }
    }
}
