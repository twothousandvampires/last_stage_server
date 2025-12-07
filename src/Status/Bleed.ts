import Func from '../Func'
import Blood from '../Objects/Effects/Blood'
import Character from '../Objects/src/Character'
import Status from './Status'

export default class Bleed extends Status {
    constructor(public time: number) {
        super(time)
        this.need_to_check_resist = true
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'bleed',
                duration: this.duration,
                desc: 'get damage while moving',
            })
        }
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += 1000
            if (this.unit.is_moving) {
                this.unit.takePureDamage()

                let e = new Blood(this.unit.level)
                e.setPoint(Func.random(this.unit.x - 2, this.unit.x + 2), this.unit.y)
                e.z = Func.random(2, 8)
                this.unit.level.effects.push(e)
            }
        }
    }
}
