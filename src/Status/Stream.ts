import Character from '../Objects/src/Character'
import Status from './Status'

export default class Stream extends Status {
    name: string

    constructor(public time: number) {
        super(time)
        this.name = 'stream'
        this.need_to_check_resist = false
    }

    apply(unit: any) {
        this.unit = unit
        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'stream',
                duration: this.duration,
                desc: 'get resourse over time',
            })
        }
    }

    clear() {}

    act(tick: number) {
        if (tick - this.last_checked >= 2000) {
            this.last_checked = tick
            this.unit.addResourse()
        }
    }

    update(status: any) {
        this.time = Date.now()

        this.unit.newStatus({
            name: 'stream',
            duration: this.duration,
            desc: 'get resourse over time',
        })
    }
}
