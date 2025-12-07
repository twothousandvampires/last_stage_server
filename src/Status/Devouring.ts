import Func from '../Func'
import Devour from '../Objects/Effects/Devour'
import Character from '../Objects/src/Character'
import Exhaustion from './Exhaustion'
import Status from './Status'

export default class Devouring extends Status {
    name: string
    count: number = 0
    last_trigger_time: number = 0

    constructor(public time: number) {
        super(time)
        this.name = 'devouring'
    }

    apply(unit: any) {
        this.unit = unit
        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'devouring',
                duration: this.duration,
                desc: '?',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.move_speed_penalty -= 1 * this.count
            this.unit.attack_speed += 10 * this.count
            this.unit.cast_speed += 10 * this.count

            let s = new Exhaustion(this.unit.level.time)
            s.setDuration(6000)

            this.unit.level.setStatus(this.unit, s)
        }
    }

    act(tick_time: number) {
        if (tick_time - this.last_trigger_time >= 1500) {
            this.last_trigger_time = tick_time

            let targets = this.unit?.level.enemies.filter(
                elem => elem.is_corpse && Func.distance(this.unit, elem) <= 12
            )
            let t = Func.getRandomFromArray(targets)

            if (t) {
                this.unit?.level.removeEnemy(t)

                let e = new Devour(this.unit?.level)
                e.setPoint(t.x, t.y)

                this.unit?.level.effects.push(e)

                this.update(undefined)
            }
        }
    }

    update(status: any) {
        if (!this.unit) return

        this.time = Date.now()

        if (!status) {
            this.count++
            this.unit.move_speed_penalty += 1
            this.unit.attack_speed -= 10
            this.unit.cast_speed -= 10
        }

        this.unit.newStatus({
            name: 'devouring',
            duration: this.duration,
            desc: '?',
        })
    }
}
