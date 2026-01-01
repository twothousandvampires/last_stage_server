import Func from '../../Func'
import Level from '../../Level'
import EnvelopingMucus from '../../Status/EnvelopingMucus'
import Projectiles from './Projectiles'

export class SwirlingMucusProj extends Projectiles {

    w: number
    cyrcle: number = 0

    constructor(level: Level, private distance = 10) {
        super(level)
        this.box_r = 0.5
        this.name = 'flying mucus'
        this.move_speed = 1
        this.w = 1
    }

    setPoint(x: number = 0, y: number = 0): void {
        this.x = x
        this.y = y
    }

    act(): void {
        let players = this.level.players

        for (let i = 0; i < players.length; i++) {
            let p = players[i]
            if (p === this.owner) continue

            if (
                !p.is_dead &&
                this.w >= p.z &&
                Func.elipseCollision(this.getBoxElipse(), p.getBoxElipse())
            ) {
                if (!p.isBlock()) {
                    let s = new EnvelopingMucus(this.level.time)
                    s.setDuration(5500)
                    this.level.setStatus(p, s, true)
                } else {
                    p.succesefulBlock(this.owner)
                }

                this.impact()
                return
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
            if(this.cyrcle > 5){
                this.impact()
                return
            }
            else{
                this.cyrcle ++
                this.angle_added = 0
            }
            
        }

        this.wasChanged()
    }
}