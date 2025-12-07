import Character from '../Objects/src/Character'
import Status from './Status'

export default class Luck extends Status {
    constructor(public time: number) {
        super(time)
        this.name = 'inner power'
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.is_lucky = true
            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'luck',
                duration: this.duration,
                desc: 'you are lucky',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.is_lucky = false
        }
    }
}
