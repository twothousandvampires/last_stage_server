import Func from '../../Func'
import Level from '../../Level'
import Projectiles from './Projectiles'

export class InfernoFlame extends Projectiles {
    hitted: any
    w: number
    start_time: number

    constructor(level: Level, private angle_diff: number = 0.05) {
        super(level)
        this.box_r = 1
        this.name = 'flame'
        this.move_speed = 0.6
        this.hitted = []
        this.light_r = 6
        this.w = 8
        this.start_time = Date.now()
    }

    act(tick: number): void {
        if (tick - this.start_time >= 5000) {
            this.impact()
            return
        }

        let enemies = this.level.enemies

        for (let i = 0; i < enemies.length; i++) {
            let e = enemies[i]
            if (
                !this.hitted.includes(e.id) &&
                Func.elipseCollision(this.getBoxElipse(), e.getBoxElipse())
            ) {
                e.takeDamage(undefined, {
                    burn: true,
                    damage_value: 3
                })
                this.hitted.push(e.id)
            }
        }

        this.moveAct()

        this.angle += this.angle_diff
        this.move_speed += 0.01
    }
}
