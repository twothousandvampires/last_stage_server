import Func from '../Func'
import Status from './Status'

export default class IcePresenceStatus extends Status {
    chance: number

    constructor(time: number) {
        super(time)
        this.name = 'ice presence'
        this.chance = 0
    }

    apply(unit: any) {
        this.unit = unit
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += 1500
            if (!this.unit) return
            this.unit.level.enemies.forEach(elem => {
                if (elem.freezed && Func.distance(this.unit, elem) <= 15) {
                    elem.takePureDamage(this.unit, {})
                }
            })
        }
    }

    update(status: any): void {
        this.power += status.power
    }
}
