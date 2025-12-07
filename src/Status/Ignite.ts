import Func from '../Func'
import FireExplosionSmall from '../Objects/Effects/FireExplosionSmall'
import Character from '../Objects/src/Character'
import Status from './Status'

export default class Ignite extends Status {
    last_checked: number
    provider: any = undefined

    constructor(public time: number) {
        super(time)
        this.last_checked = time
        this.need_to_check_resist = true
    }

    apply(unit: any) {
        this.unit = unit
        let e = new FireExplosionSmall(unit.level)
        e.setPoint(unit.x, unit.y)
        unit.level.effects.push(e)

        unit.ignited = true

        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()
            this.unit.newStatus({
                name: 'ignite_status',
                duration: this.duration,
                desc: 'you are ignited',
            })
        }
    }

    clear() {
        if (this.unit) {
            this.unit.ignited = false
        }
    }

    update(status: any) {
        this.time = Date.now()

        if (this.unit instanceof Character) {
            this.unit.newStatus({
                name: 'ignite_status',
                duration: this.duration,
                desc: 'you are ignited',
            })
        }
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += 1000
            if (Func.chance(this.power)) {
                this.unit?.takePureDamage(this.provider, {
                    burn: true,
                })
            }
        }
    }
}
