import Func from '../../Func'
import Level from '../../Level'
import AttackingGhostCultist from './AttackingGhostCultist'
import Effect from './Effects'

export default class WalkingGhostCultist extends Effect {
    target: any
    flipped: boolean
    restless: boolean

    constructor(
        level: Level,
        public start_power: number = 0
    ) {
        super(level)
        this.name = 'walking ghost cultist'
        this.move_speed = 0.4
        this.box_r = 2
        this.flipped = false
        this.restless = false
    }

    toJSON() {
        return {
            x: this.x,
            y: this.y,
            id: this.id,
            name: this.name,
            z: this.z,
            light_r: this.light_r,
            flipped: this.flipped,
        }
    }

    delete() {
        this.level.deleted.push(this.id)
        this.level.binded_effects = this.level.binded_effects.filter(elem => elem != this)
    }

    explode(time: number) {
        let sprite = new AttackingGhostCultist(this.level)
        sprite.restless = this.restless
        sprite.start = time
        sprite.setPoint(this.x, this.y)
        sprite.hit_x = this.target.x
        sprite.hit_y = this.target.y
        this.level.binded_effects.push(sprite)

        this.delete()
    }

    act(time: number) {
        if (this.target.is_dead) {
            this.delete()
            return
        }
        if (Func.elipseCollision(this.getBoxElipse(), this.target.getBoxElipse())) {
            this.explode(time)
        } else {
            let angle = Func.angle(this.x, this.y, this.target.x, this.target.y)
            let l = 1 - Math.abs(0.5 * Math.cos(angle))

            let n_x = Math.sin(angle) * l
            let n_y = Math.cos(angle) * l

            n_x *= this.move_speed
            n_y *= this.move_speed

            if (n_x < 0) {
                this.flipped = true
            } else {
                this.flipped = false
            }

            this.addToPoint(n_x, n_y)
            this.wasChanged()
        }
    }
}
