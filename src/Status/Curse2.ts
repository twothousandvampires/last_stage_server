import Character from '../Objects/src/Character'
import Status from './Status'

export default class Curse2 extends Status {
    constructor(public time: number) {
        super(time)
        this.name = 'curse'
        this.need_to_check_resist = true
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'curse',
                duration: this.duration,
                desc: 'after end the curse you will lose all ward',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.loseWard(666)
        }
    }
}
