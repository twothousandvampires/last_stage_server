import Character from '../Objects/src/Character'
import Status from './Status'

export default class EternalThirst extends Status {
    constructor(public time: number) {
        super(time)
        this.name = 'eternal thirst'
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()

            this.unit.phasing = true
            this.unit.move_speed_penalty += 100
            this.unit.critical += 50
            this.unit.pierce += 100

            this.unit.newStatus({
                name: 'eternal thirst',
                duration: this.duration,
                desc: 'Your are phased, critical chance increased by 50, pierce rating increased by 100, move speed increased by 100',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.phasing = false
            this.unit.move_speed_penalty -= 100
            this.unit.critical -= 50
            this.unit.pierce -= 100
        }
    }
}