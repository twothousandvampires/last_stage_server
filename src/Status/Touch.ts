import Character from '../Objects/src/Character'
import Status from './Status'

export default class Touch extends Status {
    name: string

    constructor(public time: number) {
        super(time)
        this.name = 'touch'
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.might += 10
            this.unit.perception += 10
            this.unit.knowledge += 10
            this.unit.will += 10
            this.unit.durability += 10
            this.unit.agility += 10

            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'grace',
                duration: this.duration,
                desc: 'stats increased by 10',
            })
        }
    }

    update(status: any): void {
        this.time = Date.now()

        this.unit.newStatus({
            name: 'grace',
            duration: this.duration,
        })
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.might -= 10
            this.unit.perception -= 10
            this.unit.knowledge -= 10
            this.unit.will -= 10
            this.unit.durability -= 10
            this.unit.agility -= 10
        }
    }
}
