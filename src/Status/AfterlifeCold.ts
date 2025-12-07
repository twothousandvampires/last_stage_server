import Func from '../Func'
import Status from './Status'

export default class AfterlifeCold extends Status {
    constructor(public time: number) {
        super(time)
    }

    apply(unit: any) {
        this.unit = unit
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += 300
            this.unit.level.enemies.forEach(elem => {
                if (Func.elipseCollision(elem.getBoxElipse(), this.unit.getBoxElipse())) {
                    elem.setFreeze(5000)
                }
            })
        }
    }
}
