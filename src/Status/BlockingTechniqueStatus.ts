import Character from '../Objects/src/Character'
import Status from './Status'

export default class BlockingTechniqueStatus extends Status {
    name: string

    constructor(public time: number) {
        super(time)
        this.name = 'poison'
        this.need_to_check_resist = true
    }

    apply(unit: any) {
        this.unit = unit
        if (this.unit instanceof Character) {
            this.unit.can_regen_life = false
            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'poison',
                duration: this.duration,
                desc: 'cannot regenerate life',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.can_regen_life = true
        }
    }

    update(status: any) {
        this.time = Date.now()

        this.unit.newStatus({
            name: 'poison',
            duration: this.duration,
            desc: 'cannot regenerate life',
        })
    }
}
