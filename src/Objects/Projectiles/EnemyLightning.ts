import Func from '../../Func'
import Level from '../../Level'
import ShockStatus from '../../Status/ShockStatus'
import Projectiles from './Projectiles'

export class EnemyLightning extends Projectiles {
    start_x: number | undefined
    start_y: number | undefined
    w: number

    constructor(level: Level) {
        super(level)
        this.box_r = 0.5
        this.name = 'lightning'
        this.move_speed = 1.1
        this.w = 1
    }

    setPoint(x: number = 0, y: number = 0): void {
        this.start_x = x
        this.start_y = y
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
                p.takeDamage(this.owner)

                if (Func.chance(15)) {
                    let s = new ShockStatus(this.level.time)
                    s.setDuration(4000)
                    s.setPower(25)
                    this.level.setStatus(p, s)
                }

                this.impact()
                return
            }
        }

        this.moveAct()
    }
}
