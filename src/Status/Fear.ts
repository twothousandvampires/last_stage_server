import Func from '../Func'
import Character from '../Objects/src/Character'
import Unit from '../Objects/src/Unit'
import Status from './Status'

export default class Fear extends Status {
    fear_target: any

    constructor(public time: number) {
        super(time)
        this.need_to_check_resist = true
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()

            this.unit.can_be_controlled_by_player = false
            this.unit.reduceSecondResourse(100)

            this.unit.newStatus({
                name: 'fear',
                duration: this.duration,
                desc: 'fear',
            })
        }
    }

    setFearTarget(target: Unit) {
        this.fear_target = target
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += 1000
            if (this.fear_target) {
                this.unit.angle_for_forced_movement = Func.angle(
                    this.fear_target.x,
                    this.fear_target.y,
                    this.unit.x,
                    this.unit.y
                )
            } else {
                this.unit.angle_for_forced_movement = Math.random() * 6.28
            }
        }
    }

    update(status: any): void {
        this.time = Date.now()
    }

    clear(): void {
        if (!this.unit.is_dead) {
            this.unit.can_be_controlled_by_player = true
        }
        this.unit.angle_for_forced_movement = undefined
    }
}
