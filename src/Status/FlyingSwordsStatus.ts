import Func from '../Func'
import FlyingSwordsEffect from '../Objects/Effects/FlyingSwordsEffect'
import { FlyingSword } from '../Objects/Projectiles/FlyingSword'
import Status from './Status'

export default class FlyingSwordsStatus extends Status {
    radius: number
    x: any
    y: any
    effect: any

    constructor(public time: number) {
        super(time)
        this.radius = 10
    }

    clear() {
        if (this.effect) {
            this.effect.delete()
        }
    }

    apply(unit: any) {
        this.unit = unit

        let effect = new FlyingSwordsEffect(this.unit.level)
        effect.setOwner(this.unit)
        effect.setPoint(this.unit.x, this.unit.y)

        this.effect = effect

        unit.level.binded_effects.push(this.effect)
    }

    act(tick_time: number) {
        if (!this.unit) return

        if (tick_time > this.last_checked) {
            this.last_checked += 1000

            for (let i = 0; i < this.unit.level.enemies.length; i++) {
                let e = this.unit.level.enemies[i]

                if (!e.is_dead && Func.distance(this.unit, e) <= 18) {
                    let proj = new FlyingSword(this.unit.level)
                    proj.setAngle(Func.angle(this.unit.x, this.unit.y, e.x, e.y))
                    proj.setPoint(this.unit.x, this.unit.y)
                    proj.setOwner(this.unit)

                    this.unit.level.projectiles.push(proj)

                    return
                }
            }
        }
    }
}
