import Func from '../../Func'
import Level from '../../Level'
import Effect from './Effects'

export default class Gate extends Effect {
    constructor(level: Level) {
        super(level)
        this.name = 'gate'

        this.box_r = 1.8
        this.zone_id = 1
        this.x = 195
        this.y = 50
    }

    act(time: number) {
        this.level.players.forEach(elem => {
            if (Func.elipseCollision(elem.getBoxElipse(), this.getBoxElipse())) {
                elem.exitGrace()
            }
        })
    }
}
