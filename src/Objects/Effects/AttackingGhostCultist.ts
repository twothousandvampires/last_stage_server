import Func from '../../Func'
import Level from '../../Level'
import Effect from './Effects'
import WalkingGhostCultist from './WalkingGhostCultist'

export default class AttackingGhostCultist extends Effect {
    target: any
    flipped: boolean
    start: number | undefined
    action_time: number
    hit_x: number | undefined
    hit_y: number | undefined
    restless: boolean

    constructor(
        level: Level,
        public start_power: number = 0
    ) {
        super(level)
        this.name = 'attacking ghost cultist'
        this.move_speed = 0
        this.box_r = 2
        this.flipped = false
        this.action_time = 1500
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
            action_time: this.action_time,
        }
    }

    explode() {
        if (this.restless) {
            let ghost = new WalkingGhostCultist(this.level)
            if (this.target && !this.target.is_dead) {
                ghost.target = this.target
            } else {
                let e = this.getBoxElipse()
                e.r = 15
                let enemy = this.level.enemies.filter(elem => {
                    return Func.elipseCollision(elem.getBoxElipse(), e)
                })

                ghost.target = enemy[Math.floor(Math.random() * enemy.length)]
            }

            if (ghost.target) {
                ghost.setPoint(this.x, this.y)
                this.level.binded_effects.push(ghost)
            }

            this.delete()
        } else {
            this.delete()
        }
    }

    act(time: number) {
        if (time - this.start >= this.action_time) {
            if (!this.hit_x || !this.hit_y) return

            let e = this.getBoxElipse()
            e.r = 8
            e.x = this.hit_x
            e.y = this.hit_y

            this.level.enemies.forEach(elem => {
                if (Func.elipseCollision(elem.getBoxElipse(), e)) {
                    elem.takeDamage()
                }
            })

            this.explode()
        }
    }
}
