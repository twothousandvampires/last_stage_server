import Func from '../Func'
import Character from '../Objects/src/Character'
import Status from './Status'

export default class ShockStatus extends Status {
    last_checked: number

    constructor(public time: number) {
        super(time)
        this.last_checked = time
        this.need_to_check_resist = true
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()
            this.unit.shocked = true

            this.unit.newStatus({
                name: 'zap',
                duration: this.duration,
                desc: 'you are shocked',
            })
        }
    }

    clear() {
        this.unit.shocked = false
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += 500
            if (!this.unit.zaped && Func.chance(this.power)) {
                let duration = Func.random(500, 1500)
                this.unit.setZap(duration)
            }
        }
    }
}
