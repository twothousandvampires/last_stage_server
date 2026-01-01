import Func from '../../Func'
import Level from '../../Level'
import Poison from '../../Status/Poison'
import Projectiles from './Projectiles'

export class PoisonousBone extends Projectiles {
    w: number

    constructor(level: Level) {
        super(level)
        this.box_r = 0.3
        this.name = 'sharped bone'
        this.move_speed = 0.8
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
                let prev = p.life_status
                p.takeDamage(this.owner)
                if(prev > p.life_status){
                    let s = new Poison(p.level.time)
                    s.setDuration(6500)
                    p.level.setStatus(p, s, true)
                }
                this.impact()
                return
            }
        }

        this.moveAct()
    }
}