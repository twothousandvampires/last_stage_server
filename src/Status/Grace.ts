import Character from '../Objects/src/Character'
import Status from './Status'

export default class Grace extends Status {
    name: string

    constructor(public time: number) {
        super(time)
        this.name = 'grace'
        this.need_to_check_resist = false
    }

    drain() {
        this.unit.might += 2
        this.unit.perception += 2
        this.unit.will += 2
        this.unit.knowledge += 2
        this.unit.durability += 2
        this.unit.agility += 2
    }

    apply(unit: any) {
        this.unit = unit
        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()
            this.drain()

            this.unit.newStatus({
                name: 'service',
                duration: this.duration,
                desc: 'your stats are increased',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.might -= 2
            this.unit.perception -= 2
            this.unit.durability -= 2
            this.unit.agility -= 2
            this.unit.will -= 2
            this.unit.knowledge -= 2
        }
    }

    update(status: any) {
        this.time = Date.now()
    }
}
