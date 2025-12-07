import Character from '../Objects/src/Character'
import Status from './Status'

export default class Corrosion extends Status {
    name: string

    constructor(public time: number) {
        super(time)
        this.name = 'corrosion'
        this.need_to_check_resist = true
    }

    apply(unit: any) {
        this.unit = unit
        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()

            this.unit.item.forEach(elem => elem.disable())

            this.unit.newStatus({
                name: 'corrosion',
                duration: this.duration,
                desc: 'items are disabled',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.item.forEach(elem => elem.enable())
        }
    }

    update(status: any) {
        this.time = Date.now()

        this.unit.newStatus({
            name: 'corrosion',
            duration: this.duration,
            desc: 'items are disabled',
        })
    }
}
