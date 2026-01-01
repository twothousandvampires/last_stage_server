import Character from '../Objects/src/Character'
import Status from './Status'

export default class EnvelopingMucus extends Status {
    name: string
    stack: number = 1
    effect_per_stack: number = 12

    constructor(public time: number) {
        super(time)
        this.name = 'enveloping mucus'
        this.need_to_check_resist = true
    }

    apply(unit: any) {
        this.unit = unit
        if (this.unit instanceof Character) {
            this.unit.addMoveSpeedPenalty(-this.effect_per_stack)
            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'enveloping mucus',
                duration: this.duration,
                desc: 'movement is reduced',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.addMoveSpeedPenalty(this.effect_per_stack * this.stack)
        }
    }

    update(status: any) {
        this.time = Date.now()
        this.stack ++

        this.unit.addMoveSpeedPenalty(-this.effect_per_stack)

        this.unit.newStatus({
            name: 'enveloping mucus',
            duration: this.duration,
            desc: 'movement is reduced',
        })
    }
}
