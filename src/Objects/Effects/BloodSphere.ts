import Func from '../../Func'
import Level from '../../Level'
import { BloodShard } from '../Projectiles/BloodShard'
import Effect from './Effects'

export default class BloodSphere extends Effect {
    time: number
    pool: any

    constructor(
        level: Level,
        public start_power: number = 0
    ) {
        super(level)
        this.name = 'blood sphere'
        this.time = Date.now()
        this.box_r = 1.8
        this.pool = []
        this.z = 8
    }

    explode() {
        let count = this.start_power + this.pool.length

        let zones = 6.28 / count

        for (let i = 1; i <= count; i++) {
            let min_a = (i - 1) * zones
            let max_a = i * zones

            let angle = Math.random() * (max_a - min_a) + min_a
            let proj = new BloodShard(this.level)
            proj.setAngle(angle)
            proj.setPoint(this.x, this.y)

            this.level.projectiles.push(proj)
        }
    }

    act(time: number) {
        if (time - this.time >= 5000) {
            this.explode()
            this.delete()
            return
        }

        this.level.enemies.forEach(elem => {
            if (
                elem.is_dead &&
                !this.pool.includes(elem.id) &&
                Func.elipseCollision(elem.getBoxElipse(), this.getBoxElipse())
            ) {
                this.pool.push(elem.id)
            }
        })
    }
}
