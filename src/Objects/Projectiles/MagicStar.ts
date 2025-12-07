import Func from '../../Func'
import Level from '../../Level'
import Projectiles from './Projectiles'

export class MagicStar extends Projectiles {
    w: number

    constructor(level: Level) {
        super(level)
        this.box_r = 0.4
        this.name = 'magic star'
        this.move_speed = 0.7
        this.w = 3
    }

    act(): void {
        for (let i = 0; i < this.level.players.length; i++) {
            let p = this.level.players[i]

            if (
                !p.is_dead &&
                p.z < this.w &&
                Func.elipseCollision(this.getBoxElipse(), p.getBoxElipse())
            ) {
                p.takeDamage()
                this.impact()
                return
            }
        }

        this.moveAct()
    }
}
