import Func from '../../Func'
import Level from '../../Level'
import Projectiles from './Projectiles'

export class SoulShatterProj extends Projectiles {
    w: number
    start_x: number | undefined
    start_y: number | undefined
    start: any
    duration: number
    change_angle: any

    constructor(level: Level) {
        super(level)
        this.box_r = 0.4
        this.name = 'specter soul seeker'
        this.move_speed = 0.4
        this.w = 3
        this.duration = 10000
    }

    setStart(time: number) {
        this.start = time
        this.change_angle = time
    }

    setPoint(x: number = 0, y: number = 0): void {
        this.start_x = x
        this.start_y = y
        this.x = x
        this.y = y
    }

    act(tick: number): void {
        if (tick - this.start >= this.duration) {
            this.impact()
            return
        }

        if (tick - this.change_angle >= 500) {
            this.change_angle += 500
            if (Math.random() > 0.5) {
                this.angle += 0.5
            } else {
                this.angle -= 0.5
            }
        }

        this.level.enemies.forEach(elem => {
            if (!elem.is_dead && Func.elipseCollision(elem.getBoxElipse(), this.getBoxElipse())) {
                elem.takeDamage(this.owner)
                this.impact()
            }
        })

        let l = 1 - Math.abs(0.5 * Math.cos(this.angle))

        let n_x = Math.sin(this.angle) * l
        let n_y = Math.cos(this.angle) * l

        n_x *= this.move_speed
        n_y *= this.move_speed

        if (this.isOutOfMap(this.x + n_x, this.y + n_y)) {
            this.reflect(this.isOutOfMap(this.x + n_x, this.y) ? 90 : 0)
            return
        } else {
            if (n_x < 0) {
                this.flipped = true
            } else {
                this.flipped = false
            }

            this.addToPoint(n_x, n_y)
        }
        this.wasChanged()
    }

    reflect(angle: number) {
        let normalAngle = angle + Math.PI / 2

        let incidenceAngle = this.angle - normalAngle

        let reflectedAngle = normalAngle - incidenceAngle

        this.angle = (reflectedAngle + 2 * Math.PI) % (2 * Math.PI)
    }
}
