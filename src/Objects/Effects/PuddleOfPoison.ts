import Func from '../../Func'
import Level from '../../Level'
import Poison from '../../Status/Poison'
import Effect from './Effects'

export default class PuddleOfPoison extends Effect {
    x: any
    y: any
    last_check_time: number
    timer: number
    start: number

    constructor(level: Level) {
        super(level)
        this.name = 'puddle of poison'
        this.x = undefined
        this.y = undefined
        this.timer = 1000
        this.last_check_time = Date.now() + 1000
        this.box_r = 12
        this.start = Date.now()
    }

    act(game_tick: number) {
        if (game_tick - this.start >= 10000) {
            this.delete()
            return
        }

        if (game_tick - this.last_check_time >= this.timer) {
            this.last_check_time += this.timer

            this.level.players.forEach(elem => {
                if (Func.elipseCollision(this.getBoxElipse(), elem.getBoxElipse())) {
                    let status = new Poison(game_tick)
                    status.setDuration(1000)

                    this.level.setStatus(elem, status, true)
                }
            })
        }
    }
}
