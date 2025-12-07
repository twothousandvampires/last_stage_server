import Func from '../Func'
import Character from '../Objects/src/Character'
import Status from './Status'

export default class Apathy extends Status {
    name: string
    power: number

    constructor(public time: number) {
        super(time)
        this.name = 'apathy'
        this.need_to_check_resist = true
        this.power = 1
    }

    apply(unit: any) {
        this.unit = unit
        if (this.unit instanceof Character) {
            this.affect()
            this.unit.newStatus({
                name: 'apathy',
                duration: this.duration,
                desc: 'apathy',
            })
        }
    }

    affect() {
        this.unit.move_speed_penalty -= 10
        this.unit.attack_speed += 100
        this.unit.cast_speed += 100
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.move_speed_penalty += 10 * this.power
            this.unit.attack_speed -= 100 * this.power
            this.unit.cast_speed -= 100 * this.power
        }
    }

    update(status: any): void {
        this.power++
        this.time = Date.now()

        this.affect()

        this.unit.newStatus({
            name: 'apathy',
            duration: this.duration,
            desc: 'apathy',
        })
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += 1000

            if (Func.chance(this.power * 2)) {
                this.unit.takeDamage()
            }
        }
    }
}
