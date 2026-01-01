import Level from '../../Level'
import GameObject from '../src/GameObject'
import Unit from '../src/Unit'

export default abstract class Projectiles extends GameObject {
    angle: number | undefined
    owner: Unit | undefined
    flipped: boolean
    light_r: number

    constructor(level: Level) {
        super(level)
        this.flipped = false
        this.light_r = 0
    }

    impact() {
        this.level.deleted.push(this.id)
        this.level.projectiles = this.level.projectiles.filter(elem => elem != this)
    }

    delete(){
        this.level.projectiles = this.level.projectiles.filter(elem => elem != this)
        this.level.deleted.push(this.id)
    }

    setAngle(angle: number) {
        this.angle = angle
    }

    setOwner(owner: Unit) {
        this.owner = owner
    }

    moveAct() {
        let l = 1 - Math.abs(0.5 * Math.cos(this.angle))

        let n_x = Math.sin(this.angle) * l
        let n_y = Math.cos(this.angle) * l

        n_x *= this.move_speed
        n_y *= this.move_speed

        if (this.isOutOfMap(this.x + n_x, this.y + n_y)) {
            this.impact()
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

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            name: this.name,
            z: this.z,
            flipped: this.flipped,
            light_r: this.light_r,
        }
    }
}
