import Func from '../../Func'
import Level from '../../Level'
import Ignite from '../../Status/Ignite'
import FireExplosion from '../Effects/FireExplosion'
import Projectiles from './Projectiles'

export class FlamyFireBall extends Projectiles {
    w: number
    constructor(level: Level) {
        super(level)
        this.box_r = 0.5
        this.name = 'flamy_fireball'
        this.move_speed = 0.25
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
                this.impact()
                return
            }
        }

        this.moveAct()
    }

    impact() {
        let effect = new FireExplosion(this.level)
        effect.setPoint(this.x, this.y)
        this.level.addSound('fire explosion', this.x, this.y)
        this.level.effects.push(effect)

        let explosion = this.getBoxElipse()
        explosion.r = 4

        this.level.players.forEach(p => {
            if (p.z < 5 && Func.elipseCollision(explosion, p.getBoxElipse())) {
                p.takeDamage(this.owner)
                if (Func.chance(15)) {
                    let s = new Ignite(this.level.time)
                    s.setDuration(6000)
                    s.setPower(20)
                    s.provider = this

                    this.level.setStatus(p, s, true)
                }
            }
        })

        this.level.deleted.push(this.id)
        this.level.projectiles = this.level.projectiles.filter(elem => elem != this)
    }
}
