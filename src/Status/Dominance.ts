import Character from '../Objects/src/Character'
import Status from './Status'

export default class Dominance extends Status {
    constructor(public time: number) {
        super(time)
        this.name = 'dominance'
    }

    apply(unit: any) {
        this.unit = unit
        if (this.unit instanceof Character) {
            this.unit.power += 15

            this.unit.newStatus({
                name: 'dominance',
                duration: this.duration,
                desc: 'power is increased by 15',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.power -= 15
        }
    }

    update(status: any) {
        this.time = Date.now()

        this.unit.newStatus({
            name: 'dominance',
            duration: this.duration,
            desc: 'power is increased by 15',
        })
    }
}
