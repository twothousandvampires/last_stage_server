import Character from '../Objects/src/Character'
import Status from './Status'

export default class Exhaustion extends Status {
    constructor(public time: number) {
        super(time)
        this.name = 'exhaustion'
        this.need_to_check_resist = true
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()

            this.unit.first_ability.cost += 1
            this.unit.second_ability.cost += 1
            this.unit.third_ability.cost += 1

            this.unit.first_ability.cd += 1500
            this.unit.second_ability.cd += 1500
            this.unit.third_ability.cd += 1500

            this.unit.newStatus({
                name: 'exhaustion',
                duration: this.duration,
                desc: 'abilities cost are increased and has longer cooldown',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.first_ability.cost -= 1
            this.unit.second_ability.cost -= 1
            this.unit.third_ability.cost -= 1

            this.unit.first_ability.cd -= 1500
            this.unit.second_ability.cd -= 1500
            this.unit.third_ability.cd -= 1500
        }
    }

    update(status: any): void {
        if (this.unit instanceof Character) {
            super.update(status)

            this.unit.newStatus({
                name: 'exhaustion',
                duration: this.duration,
                desc: 'abilities cost are increased and has longer cooldown',
            })
        }
    }
}
