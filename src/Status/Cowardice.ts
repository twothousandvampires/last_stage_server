import Character from '../Objects/src/Character'
import Status from './Status'

export default class Cowardice extends Status {
    name: string

    constructor(public time: number) {
        super(time)
        this.name = 'cowardice'
        this.need_to_check_resist = true
    }

    apply(unit: any) {
        this.unit = unit
        if (this.unit instanceof Character) {
            this.unit.can_get_courage = false
            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'cowardice',
                duration: this.duration,
                desc: 'cannot get courage',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.can_get_courage = true
        }
    }

    update(status: any) {
        this.time = Date.now()

        this.unit.newStatus({
            name: 'cowardice',
            duration: this.duration,
            desc: 'cannot get courage',
        })
    }
}
