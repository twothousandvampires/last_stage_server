import Character from '../Objects/src/Character'
import GhostGripEffect from '../Objects/Effects/GhostGrip'
import Status from './Status'

export default class GhostGrip extends Status {
    effect: any
    name: string

    constructor(public time: number) {
        super(time)
        this.name = 'ghost grip'
        this.need_to_check_resist = true
    }

    apply(unit: any) {
        this.unit = unit
        if (this.unit instanceof Character) {
            this.unit.addMoveSpeedPenalty(-50)
            this.unit.statusWasApplied()

            this.effect = new GhostGripEffect(this.unit.level)
            this.effect.setOwner(this.unit)

            this.unit.level.binded_effects.push(this.effect)

            this.unit.newStatus({
                name: 'ghost grip',
                duration: this.duration,
                desc: 'movement is highed reduced',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.addMoveSpeedPenalty(50)

            this.unit.level.deleted.push(this.effect.id)
            this.unit.level.binded_effects = this.unit.level.binded_effects.filter(
                e => e != this.effect
            )
        }
    }

    update(status: any) {
        this.time = Date.now()

        this.unit.newStatus({
            name: 'ghost grip',
            duration: this.duration,
            desc: 'movement is highed reduced',
        })
    }
}
