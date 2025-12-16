import Func from '../Func'
import Character from '../Objects/src/Character'
import Fragility from './Fragility'
import Status from './Status'

export default class CrystalGreavesStatus extends Status {
    constructor(public time: number) {
        super(time)
    }

    apply(unit: any) {
        this.unit = unit
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += 1000
            if (this.unit instanceof Character) {
                if (!this.unit.is_moving) {
                    let s = new Fragility(tick_time)
                    s.setDuration(1500)
                    this.unit.level.setStatus(this.unit, s, true)
                } else {
                    this.unit.level.enemies.forEach(elem => {
                        if (Func.distance(elem, this.unit) <= 10) {
                            let s = new Fragility(tick_time)
                            s.setDuration(2000)

                            this.unit.level.setStatus(elem, s, true)
                        }
                    })
                }
            }
        }
    }
}