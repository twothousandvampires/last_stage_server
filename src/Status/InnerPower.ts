import Character from '../Objects/src/Character'
import Status from './Status'

export default class InnerPower extends Status {
    constructor(public time: number) {
        super(time)
        this.name = 'inner power'
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.armour_rate += 50
            this.unit.attack_speed -= 300
            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'inner power',
                duration: this.duration,
                desc: 'you are stronger',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.armour_rate -= 50
            this.unit.attack_speed += 300
        }
    }
}
