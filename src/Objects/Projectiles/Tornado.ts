import Func from '../../Func'
import Level from '../../Level'
import Projectiles from './Projectiles'

export default class Tornado extends Projectiles {
    start: number = Date.now()
    ttl: number = 12000
    angle: number = 0
    last_chance_dir_time: number = 0
    last_hit_time: number = 0

    constructor(level: Level) {
        super(level)
        this.name = 'tornado'
        this.move_speed = 0.06
        this.box_r = 5
    }

    act(tick: number) {
        if (tick - this.start >= this.ttl) {
            this.impact()
            return
        }

        if (tick - this.last_chance_dir_time >= 2000) {
            this.last_chance_dir_time = tick + 2000
            this.angle = Math.random() * 6.28
        }

        if (tick - this.last_hit_time >= 500) {
            this.level.enemies.forEach(elem => {
                if (
                    !elem.is_dead &&
                    Func.elipseCollision(elem.getBoxElipse(), this.getBoxElipse())
                ) {
                    elem.takeDamage(undefined, {})
                }
            })
        }

        this.moveAct()
    }
}
