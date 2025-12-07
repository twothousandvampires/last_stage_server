import Func from '../../Func'
import Level from '../../Level'
import Effect from './Effects'

export default class Bonfire extends Effect {
    last: number
    disabled: boolean = false
    constructor(level: Level) {
        super(level)
        this.name = 'bonfire'
        this.light_r = 19
        this.last = 0
    }

    act(time: number): void {
        if (this.disabled) {
            this.light_r -= 0.2
            if (this.light_r < 0) {
                this.light_r = 0
            }
            this.wasChanged()

            return
        }
        if (time - this.last > 150) {
            this.last = time

            if (Func.chance(50)) {
                if (Func.chance(50)) {
                    this.light_r--
                    if (this.light_r < 18) {
                        this.light_r = 18
                    }
                } else {
                    this.light_r++
                    if (this.light_r > 21) {
                        this.light_r = 21
                    }
                }
            }

            this.wasChanged()
        }
    }
}
