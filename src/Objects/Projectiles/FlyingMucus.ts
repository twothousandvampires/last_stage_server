import Func from '../../Func'
import Level from '../../Level'
import EnvelopingMucus from '../../Status/EnvelopingMucus'
import Projectiles from './Projectiles'

export class FlyingMucus extends Projectiles {
    w: number

    constructor(level: Level) {
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
}
