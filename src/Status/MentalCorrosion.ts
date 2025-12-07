import Character from '../Objects/src/Character'
import Status from './Status'

export default class MentalCorrosion extends Status {
    name: string

    constructor(public time: number) {
        super(time)
        this.name = 'mental corrosion'
        this.need_to_check_resist = true
    }

    apply(unit: any) {
        this.unit = unit
        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()

            this.unit.can_regen_resource = false
            this.unit.can_use_skills = false

            this.unit.newStatus({
                name: 'mental corrosion',
                duration: this.duration,
                desc: 'cannot gain resource and use skills',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.can_regen_resource = true
            this.unit.can_use_skills = true
        }
    }

    update(status: any) {
        this.time = Date.now()

        this.unit.newStatus({
            name: 'mental corrosion',
            duration: this.duration,
            desc: 'cannot gain resource and use skills',
        })
    }
}
