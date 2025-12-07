import Character from '../Objects/src/Character'
import Status from './Status'

export default class Power extends Status {
    constructor(public time: number) {
        super(time)
        this.name = 'power'
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.power += this.power

            this.unit.newStatus({
                name: 'power',
                duration: this.duration,
                desc: 'you power is increased',
            })
        }
    }

    clear() {
        this.unit.power -= this.power
    }

    update(status: any) {
        this.time = Date.now()

        if (this.unit instanceof Character) {
            this.power += status.power
            this.unit.power += status.power

            this.unit.newStatus({
                name: 'power',
                duration: this.duration,
                desc: 'you power is increased',
            })
        }
    }
}
