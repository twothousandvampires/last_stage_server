import Func from '../../Func'
import Level from '../../Level'
import Phase from '../../Status/Phase'
import Effect from './Effects'

export default class ChargedSphere extends Effect {
    x: any
    y: any
    time: number

    constructor(level: Level) {
        super(level)
        this.name = 'charged sphere'
        this.x = undefined
        this.y = undefined
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
                if (elem.can_regen_resource) {
                    elem.addResourse(2)
                }

                let phasing = new Phase(this.level.time)
                phasing.setDuration(3000)
                this.level.setStatus(elem, phasing, true)

                this.level.deleted.push(this.id)
                this.level.binded_effects = this.level.binded_effects.filter(elem => elem != this)
            }
        })
    }
}
