import Func from '../../Func'
import Level from '../../Level'
import Projectiles from './Projectiles'

export class AncientSkull extends Projectiles {
    w: number

    constructor(level: Level) {
        super(level)
        this.box_r = 0.4
        this.name = 'ancient skull'
        this.move_speed = 0.45
        this.w = 2
    }

    act(): void {
        for (let i = 0; i < this.level.players.length; i++) {
            let p = this.level.players[i]

            if (
                p != this.owner &&
                !p.is_dead &&
                p.z < this.w &&
                Func.elipseCollision(this.getBoxElipse(), p.getBoxElipse())
            ) {
                p.takeDamage(this.owner)
                this.impact()
                return
            }
        }

        for (let i = 0; i < this.level.enemies.length; i++) {
            let p = this.level.enemies[i]
            if(p === this.owner) continue

            if (
                !p.is_dead &&
                p.z < this.w &&
                Func.elipseCollision(this.getBoxElipse(), p.getBoxElipse())
            ) {
                p.takeDamage(this.owner)
                this.impact()
                return
            }
        }

        this.moveAct()
    }
}