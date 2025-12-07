import Func from '../Func'
import FireExplosion from '../Objects/Effects/FireExplosion'
import Status from './Status'

export default class FirePresenceStatus extends Status {
    chance: number

    constructor(time: number) {
        super(time)
        this.name = 'fire presence'
        this.chance = 0
    }

    apply(unit: any) {
        this.unit = unit
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += 2000

            if (!this.unit) return
            let count = 3
            this.unit.level.enemies.forEach(elem => {
                if (count > 0 && elem.ignited && Func.distance(this.unit, elem) <= 15) {
                    let e = new FireExplosion(elem.level)
                    e.setPoint(elem.x, elem.y)

                    elem.level.addEffect(e)
                    count--
                    elem.level.enemies.forEach(elem2 => {
                        if (!elem2.is_dead && Func.distance(elem, elem2) <= 12) {
                            elem2.takeDamage(this.unit, {
                                burn: true,
                            })
                        }
                    })

                    return
                }
            })
        }
    }

    update(status: any): void {
        this.power += status.power
    }
}
