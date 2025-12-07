import Func from '../Func'
import Apathy from './Apathy'
import Status from './Status'

export default class ApathyAura extends Status {
    radius: number

    constructor(public time: number) {
        super(time)
        this.radius = 10
        this.name = 'apathy aura'
    }

    clear() {}

    apply(unit: any) {
        this.unit = unit
    }

    isExpired(tick_time: number) {
        return this.unit.is_dead
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += 1000

            let box = this.unit.getBoxElipse()
            box.r = this.radius

            this.unit.level.players.forEach(elem => {
                if (Func.elipseCollision(box, elem.getBoxElipse())) {
                    let status = new Apathy(tick_time)
                    status.setDuration(5000)
                    this.unit.level.setStatus(elem, status, true)
                }
            })
        }
    }
}
