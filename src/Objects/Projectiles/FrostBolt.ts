import Func from '../../Func'
import Level from '../../Level'
import FrostExplosionSmall from '../Effects/FrostExplosionSmall'
import Projectiles from './Projectiles'

export class FrostBolt extends Projectiles {
    w: number

    constructor(level: Level) {
        super(level)
        this.box_r = 0.3
        this.name = 'frost bolt'
        this.move_speed = 1.2
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
                if (Func.chance(15)) {
                    p.setFreeze(1800)
                }

                let e = new FrostExplosionSmall(this.level)
                e.setPoint(p.x, p.y)
                this.level.effects.push(e)

                p.takeDamage(this.owner)
                this.impact()

                return
            }
        }

        this.moveAct()
    }
}
