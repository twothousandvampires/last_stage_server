import Character from '../Objects/src/Character'
import Status from './Status'

export default class Disease extends Status {
    name: string
    pierce_decrease: number = 0

    constructor(public time: number) {
        super(time)
        this.name = 'disease'
        this.need_to_check_resist = true
    }

    apply(unit: any) {
        this.unit = unit
        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()
            this.unit.status_resistance -= 30

            this.pierce_decrease = Math.round(this.unit.pierce * 0.3)

            this.unit.pierce -= this.pierce_decrease

            this.unit.newStatus({
                name: 'disease',
                duration: this.duration,
                desc: 'resist and pierce are reduced',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.status_resistance += 30
            this.unit.pierce += this.pierce_decrease
        }
    }

    update(status: any) {
        this.time = Date.now()

        this.unit.newStatus({
            name: 'disease',
            duration: this.duration,
            desc: 'resist and pierce are reduced',
        })
    }
}