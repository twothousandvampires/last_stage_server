import Func from '../../Func'
import Level from '../../Level'
import Projectiles from './Projectiles'

export class InfernoFlame extends Projectiles {
    hitted: any
    w: number
    start_time: number

    constructor(level: Level) {
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
        let players = this.level.players

        for (let i = 0; i < players.length; i++) {
            let p = players[i]
            if (p === this.owner) continue
            if (
                p.z < this.w &&
                !this.hitted.includes(p.id) &&
                Func.elipseCollision(this.getBoxElipse(), p.getBoxElipse())
            ) {
                p.takeDamage(undefined, {
                    burn: true,
                })
                this.hitted.push(p.id)
            }
        }

        for (let i = 0; i < enemies.length; i++) {
            let e = enemies[i]
            if (
                !this.hitted.includes(e.id) &&
                Func.elipseCollision(this.getBoxElipse(), e.getBoxElipse())
            ) {
                e.takeDamage(undefined, {
                    burn: true,
                })
                this.hitted.push(e.id)
            }
        }

        this.moveAct()

        this.angle += 0.05
        this.move_speed += 0.005
    }
}
