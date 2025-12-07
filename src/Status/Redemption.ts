import Func from '../Func'
import ToothExplode from '../Objects/Effects/ToothExplode'
import Status from './Status'

export default class Redemption extends Status {
    constructor(public time: number) {
        super(time)
    }

    apply(unit: any) {
        this.unit = unit
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            if (!this.unit) return

            this.last_checked += 1000

            if (Func.chance(5)) {
                let targets = this.unit.level.enemies.filter(
                    elem => elem.is_corpse && Func.distance(elem, this.unit) <= 20
                )

                let t = targets[Math.floor(Math.random() * targets.length)]

                if (t) {
                    let count = 5
                    let zones = 6.28 / count
                    let distance = 5

                    this.unit.level.deleted.push(t.id)
                    this.unit.level.addSound('holy cast', t.x, t.y)

                    for (let i = 1; i <= count; i++) {
                        let min_a = (i - 1) * zones

                        let angle = min_a
                        let e = new ToothExplode(this.unit.level)
                        e.x = t.x + Math.sin(angle) * distance
                        e.y = t.y + Math.cos(angle) * distance

                        this.unit.level.effects.push(e)
                    }

                    t.level.check(t)
                    t.level.removeEnemy(t)
                }
            }
        }
    }
}
