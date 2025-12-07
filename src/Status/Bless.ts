import BlessEffect from '../Objects/Effects/BlessEffect'
import Status from './Status'

export default class Bless extends Status {
    radius: number
    x: any
    y: any
    effect: any

    constructor(public time: number) {
        super(time)
        this.radius = 10
        this.name = 'bless'
    }

    clear() {
        this.unit.level.deleted.push(this.effect.id)
        this.unit.level.binded_effects = this.unit.level.binded_effects.filter(
            elem => elem != this.effect
        )
    }

    apply(unit: any) {
        this.unit = unit
        unit.gold_revard += 15
        unit.life_status += 1
        unit.critical += 50

        let effect = new BlessEffect(this.unit.level)
        effect.setOwner(this.unit)
        effect.setPoint(this.unit.x, this.unit.y)
        this.effect = effect

        unit.level.binded_effects.push(effect)
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += 2000
        }
    }
}
