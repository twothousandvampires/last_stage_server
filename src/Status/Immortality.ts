import Character from '../Objects/src/Character'
import Status from './Status'

export default class Immortality extends Status {
    constructor(public time: number) {
        super(time)
        this.name = 'immortality'
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.can_be_damaged = false
            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'immortality',
                duration: this.duration,
                desc: 'cannot be damaged',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.can_be_damaged = true
        }
    }
}
