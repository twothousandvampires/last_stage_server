import Func from '../Func'
import ReanimatorEffect from '../Objects/Effects/ReanimatorEffect'
import Status from './Status'

export default class Reanimator extends Status {
    radius: number
    x: any
    y: any
    effect: any

    constructor(public time: number) {
        super(time)
        this.radius = 10
        this.name = 'reanimator'
    }

    clear() {
        this.unit.level.deleted.push(this.effect.id)
        this.unit.level.binded_effects = this.unit.level.binded_effects.filter(
            elem => elem != this.effect
        )
    }

    apply(unit: any) {
        this.unit = unit
        unit.gold_revard += 2
        unit.life_status += 2

        let effect = new ReanimatorEffect(this.unit.level)
        effect.setOwner(this.unit)
        effect.setPoint(this.unit.x, this.unit.y)
        this.effect = effect

        unit.level.binded_effects.push(effect)
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += 2000
            if (!this.unit) return

            let targets = this.unit.level.enemies.filter(
                elem => elem.is_corpse && Func.distance(this.unit, elem) <= 18
            )

            let target = targets[Math.floor(Math.random() * targets.length)]

            if (target) {
                target.is_corpse = false
                target.is_dead = false
                target.life_status = 2
                target.getState()
            }
        }
    }
}
