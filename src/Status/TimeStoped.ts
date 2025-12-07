import Character from '../Objects/src/Character'
import Status from './Status'

export default class TimeStoped extends Status {
    constructor(public time: number) {
        super(time)
        this.name = 'time stoped'
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.can_regen_life = false
            this.unit.can_regen_resource = false

            this.unit.newStatus({
                name: 'time stoped',
                duration: this.duration,
                desc: 'time is stoped',
            })
        }
    }

    clear() {
        this.unit.can_regen_life = true
        this.unit.can_regen_resource = true

        this.unit.emitStatusEnd(this.name)
    }

    update(status: any) {}
}
