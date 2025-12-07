import Func from '../Func'
import Devour from '../Objects/Effects/Devour'
import Status from './Status'

export default class CrushingWave extends Status {
    chance: number

    constructor(time: number) {
        super(time)
        this.name = 'crushing wave'
        this.chance = 50
    }

    apply(unit: any) {
        this.unit = unit
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += 2000
            if (!this.unit) return

            this.unit.level.enemies.forEach(elem => {
                if (
                    elem.crushing > 0 &&
                    Func.chance(this.chance) &&
                    Func.distance(this.unit, elem) <= 15
                ) {
                    let e = new Devour(elem.level)
                    e.setPoint(elem.x, elem.y)

                    elem.level.addEffect(e)
                    elem.takePureDamage(this.unit, {})
                }
            })
        }
    }
}
