import Character from '../Objects/src/Character'
import Status from './Status'

export default class Disorientation extends Status {
    name: string
    armour_decrease: number = 0

    constructor(public time: number) {
        super(time)
        this.name = 'disorientation'
        this.need_to_check_resist = true
    }

    apply(unit: any) {
        this.unit = unit
        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()
            this.unit.move_speed_penalty -= 25

            this.armour_decrease = Math.round(this.unit.armour_rate * 0.3)

            this.unit.armour_rate -= this.armour_decrease

            this.unit.newStatus({
                name: 'disorientation',
                duration: this.duration,
                desc: 'move speed and armour are reduced',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.move_speed_penalty += 25
            this.unit.armour_rate += this.armour_decrease
        }
    }

    update(status: any) {
        this.time = Date.now()

        this.unit.newStatus({
            name: 'disorientation',
            duration: this.duration,
            desc: 'move speed and armour are reduced',
        })
    }
}