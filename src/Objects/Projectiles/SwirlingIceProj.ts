import Func from '../../Func'
import Level from '../../Level'
import Projectiles from './Projectiles'

export class SwirlingIceProj extends Projectiles {
    start_x: number | undefined
    start_y: number | undefined
    w: number
    hitted: any[] = []
    angle_added: number = 0

    constructor(
        level: Level,
        private distance = 10
    ) {
        super(level)
        this.box_r = 0.3
        this.name = 'icicle'
        this.move_speed = 1.7
        this.w = 1
    }

    act(): void {
        let enemies = this.level.enemies
        let players = this.level.players

        for (let i = 0; i < players.length; i++) {
            let p = players[i]
            if (p === this.owner) continue

            if (
                !this.hitted.includes(p.id) &&
                !p.is_dead &&
                this.w >= p.z &&
                Func.elipseCollision(this.getBoxElipse(), p.getBoxElipse())
            ) {
                if (p.freezed) {
                    this.hitted.push(p.id)
                    p.takeDamage(this.owner)
                } else {
                    p.setFreeze(1000)
                    p.takeDamage(this.owner)
                    this.impact()
                    return
                }
            }
        }

        for (let i = 0; i < enemies.length; i++) {
            let e = enemies[i]
            if (
                !this.hitted.includes(e.id) &&
                !e.is_dead &&
                Func.elipseCollision(this.getBoxElipse(), e.getBoxElipse())
            ) {
                if (e.freezed) {
                    this.hitted.push(e.id)
                    e.takeDamage(this.owner)
                } else {
                    e.setFreeze(1000)
                    e.takeDamage(this.owner)
                    this.impact()
                    return
                }
            }
        }

        this.moveAct()
    }

    moveAct() {
        if (!this.owner) return

        let l = 1 - Math.abs(0.5 * Math.cos(this.angle))

        let n_x = Math.sin(this.angle) * l * this.distance
        let n_y = Math.cos(this.angle) * l * this.distance

        n_x += this.owner.x
        n_y += this.owner.y

        if (this.isOutOfMap(n_x, n_y)) {
            this.impact()
            return
        } else {
            if (n_x < 0) {
                this.flipped = true
            } else {
                this.flipped = false
            }

            this.setPoint(n_x, n_y)
        }

        this.angle += 0.1
        this.angle_added += 0.1

        if (this.angle_added > 6.28) {
            this.hitted = []
            this.angle_added = 0
        }

        this.wasChanged()
    }
}
