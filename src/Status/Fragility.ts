import Character from '../Objects/src/Character'
import Status from './Status'

export default class Fragility extends Status {
    name: string

    constructor(public time: number) {
        super(time)
        this.name = 'fragility'
        this.need_to_check_resist = true
    }

    apply(unit: any) {
        this.unit = unit
        this.unit.fragility = true

        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'fragility',
                duration: this.duration,
                desc: 'you get double damage',
            })
        }
    }

    update(status: any): void {
        this.time = Date.now()

        if (this.unit instanceof Character) {
            this.unit.newStatus({
                name: 'fragility',
                duration: this.duration,
                desc: 'you get double damage',
            })
        }
    }

    clear() {
        this.unit.fragility = false
    }
}
