import Character from '../Objects/src/Character'
import Status from './Status'

export default class Precision extends Status {
    name: string

    constructor(public time: number) {
        super(time)
        this.name = 'precision'
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.critical += 100
            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'precision',
                duration: this.duration,
                desc: 'you lead double damage',
            })
        }
    }

    update(status: any): void {
        this.time = Date.now()

        this.unit.newStatus({
            name: 'precision',
            duration: this.duration,
            desc: 'you lead double damage',
        })
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.critical -= 100
        }
    }
}
