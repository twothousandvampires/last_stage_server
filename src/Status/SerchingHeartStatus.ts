import SearchingHeart from '../Items/SearchingHeart'
import { FireballProjectile } from '../Objects/Projectiles/FireballProjectile'
import Status from './Status'

export default class SerchingHeartStatus extends Status {
    last_trigger_time: number
    public disabled: boolean = false

    constructor(
        time: number,
        public item: SearchingHeart
    ) {
        super(time)
        this.last_trigger_time = time
    }

    unitDead() {}

    apply(unit: any) {
        this.unit = unit
    }

    clear() {}

    update(status: any) {}

    checkResist() {
        return false
    }

    isExpired() {
        return false
    }

    act(tick_time: number) {
        if (tick_time - this.last_trigger_time >= this.item.cd) {
            this.last_trigger_time = tick_time
            this.trigger()
        }
    }

    trigger() {
        if (this.item.disabled) return
        if (this.item.hit_count === 0) return

        let count = this.item.hit_count + this.item.count

        let zones = 6.28 / count

        for (let i = 1; i <= count; i++) {
            let min_a = (i - 1) * zones
            let max_a = i * zones

            let angle = Math.random() * (max_a - min_a) + min_a
            let proj = new FireballProjectile(this.unit.level)
            proj.setAngle(angle)
            proj.setOwner(this.unit)
            proj.setPoint(this.unit.x, this.unit.y)

            this.unit.level.projectiles.push(proj)
        }

        this.item.hit_count = 0
    }
}
