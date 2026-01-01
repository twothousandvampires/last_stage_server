import Func from '../../Func'
import Level from '../../Level'
import Weakness from '../../Status/Weakness'
import Effect from './Effects'

export default class SpecterVortex extends Effect {
    x: any
    y: any
    last_check_time: number
    timer: number
    start: number

    constructor(level: Level) {
        super(level)
        this.name = 'specter vortex'
        this.x = undefined
        this.y = undefined
        this.timer = 1000
        this.last_check_time = Date.now() + 1000
        this.box_r = 25
        this.start = Date.now()
    }

    act(game_tick: number) {
        if (!this.owner || game_tick - this.start >= 5000) {
            this.delete()
            return
        }

        if (game_tick - this.last_check_time >= this.timer) {
            this.last_check_time += this.timer

            this.level.players.forEach(elem => {
                if (Func.elipseCollision(this.getBoxElipse(), elem.getBoxElipse())) {
                    let status = new Weakness(game_tick)
                    status.setDuration(3000)

                    this.level.setStatus(elem, status, true)
                }
            })
        }

        this.x = this.owner.x
        this.y = this.owner.y
    }

    setOwner(character: any) {
        this.owner = character
    }
}
