import Character from '../Objects/src/Character'
import Status from './Status'

export default class Phase extends Status {
    constructor(public time: number) {
        super(time)
        this.name = 'phase'
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.phasing = true
            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'phase',
                duration: this.duration,
                desc: 'can move through enemies',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.phasing = false
        }
    }
}
