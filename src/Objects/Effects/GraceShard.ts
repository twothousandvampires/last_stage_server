import Func from '../../Func'
import Level from '../../Level'
import Grace from '../../Status/Grace'
import Effect from './Effects'

export default class GraceShard extends Effect {
    time: number
    constructor(level: Level) {
        super(level)
        this.name = 'grace shard'
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
                elem.grace ++
                let status = new Grace(elem.level.time)
                status.setDuration(8000)

                this.level.setStatus(elem, status, true)

                this.level.deleted.push(this.id)
                this.level.binded_effects = this.level.binded_effects.filter(elem => elem != this)
            }
        })
    }
}
