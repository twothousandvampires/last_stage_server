import Func from '../Func'
import EarthShaking from '../Objects/Effects/EarthShaking'
import Character from '../Objects/src/Character'
import Status from './Status'

export default class PressingSteps extends Status {
    move_count: number = 0

    constructor(public time: number) {
        super(time)
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()
        }
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += 1500
            if (this.unit.is_moving) {
                this.move_count++
                if (this.move_count >= 3) {
                    let e = new EarthShaking(this.unit.level)
                    e.setPoint(this.unit.x, this.unit.y)

                    this.unit.level.addEffect(e)
                    let add = this.move_count
                    if (add > 10) {
                        add = 10
                    }
                    this.unit.level.enemies.forEach(elem => {
                        if (!elem.is_dead && Func.distance(this.unit, elem) <= 6 + add) {
                            elem.takeDamage(this.unit)
                        }
                    })
                }
            } else {
                this.move_count = 0
            }
        }
    }
}
