import Func from '../../Func'
import Level from '../../Level'
import Effect from './Effects'

export default class Split extends Effect {
    time: number

    constructor(level: Level) {
        super(level)
        this.name = 'split'
        this.box_r = 2.2
        this.time = Date.now()
    }

    act(time: number) {
        if (time - this.time >= 10000) {
            this.delete()
            return
        }

        this.level.players.forEach(elem => {
            if (Func.elipseCollision(elem.getBoxElipse(), this.getBoxElipse())) {
                elem.light_r += 3
                elem.addLife(1, false, true)

                setTimeout(() => {
                    elem.light_r -= 3
                }, 10000)

                this.level.deleted.push(this.id)
                this.level.binded_effects = this.level.binded_effects.filter(elem => elem != this)
            }
        })
    }
}
