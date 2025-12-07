import Character from '../Objects/src/Character'
import Status from './Status'

export default class DismembermentStatus extends Status {
    constructor(public time: number) {
        super(time)
    }

    apply(unit: any) {
        this.unit = unit
        if (this.unit instanceof Character) {
            this.unit.critical += 20
            this.unit.power += 20
            this.unit.statusWasApplied()
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.critical -= 20
            this.unit.power -= 20
        }
    }

    update(status: any) {
        this.time = Date.now()
    }
}
