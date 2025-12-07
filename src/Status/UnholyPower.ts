import Func from '../Func'
import UnholyPowerEffect from '../Objects/Effects/UnholyPowerEffect'
import { UnholySkull } from '../Objects/Projectiles/UnholySkull'
import Status from './Status'

export default class UnholyPower extends Status {
    radius: number
    x: any
    y: any
    effect: any

    constructor(public time: number) {
        super(time)
        this.radius = 16
        this.name = 'unholy power'
    }

    clear() {
        this.unit.level.deleted.push(this.effect.id)
        this.unit.level.binded_effects = this.unit.level.binded_effects.filter(
            elem => elem != this.effect
        )
    }

    isExpired(tick_time: number) {
        return !this.unit || this.unit.is_dead
    }

    apply(unit: any) {
        this.unit = unit
        unit.life_status += 4
        unit.gold_revard += 4
        unit.pierce += 30

        let effect = new UnholyPowerEffect(this.unit.level)

        effect.setOwner(this.unit)
        effect.setPoint(this.unit.x, this.unit.y)
        this.effect = effect

        unit.level.binded_effects.push(effect)
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += 8000
            if (!this.unit) return

            let possible = this.unit.level.players.filter(
                elem => Func.distance(elem, this.unit) < 30
            )
            if (possible) {
                let t = possible[Math.floor(Math.random() * possible.length)]

                if (t) {
                    let proj = new UnholySkull(this.unit.level)
                    proj.setOwner(this.unit)
                    proj.setPoint(this.unit.x, this.unit.y)
                    proj.setAngle(Func.angle(this.unit.x, this.unit.y, t.x, t.y))

                    this.unit.level.projectiles.push(proj)
                }
            }
        }
    }
}
