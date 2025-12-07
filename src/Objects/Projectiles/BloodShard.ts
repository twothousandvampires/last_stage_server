import Func from '../../Func'
import Level from '../../Level'
import Projectiles from './Projectiles'

export class BloodShard extends Projectiles {
    w: number

    constructor(level: Level) {
        super(level)
        this.box_r = 0.8
        this.name = 'blood shard'
        this.move_speed = 0.4
        this.w = 2
    }

    act(): void {
        for (let i = 0; i < this.level.players.length; i++) {
            let p = this.level.players[i]

            if (
                !p.is_dead &&
                p.z < this.w &&
                Func.elipseCollision(this.getBoxElipse(), p.getBoxElipse())
            ) {
                p.addLife()
                this.impact()
                return
            }
        }

        for (let i = 0; i < this.level.enemies.length; i++) {
            let e = this.level.enemies[i]

            if (!e.is_dead && Func.elipseCollision(this.getBoxElipse(), e.getBoxElipse())) {
                e.takeDamage()
                this.impact()
                return
            }
        }

        this.moveAct()
    }
}
