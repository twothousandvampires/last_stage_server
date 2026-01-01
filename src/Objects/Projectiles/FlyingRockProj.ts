import Func from '../../Func'
import Level from '../../Level'
import Disorientation from '../../Status/Disorientation'
import Projectiles from './Projectiles'

export class FlyingRockProj extends Projectiles {
    w: number

    constructor(level: Level) {
        super(level)
        this.box_r = 0.4
        this.name = 'flying rock'
        this.move_speed = 1
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
                    if(Func.chance(30)){
                        p.setStun(3000)
                    }
                    else{
                        let s = new Disorientation(p.level.time)
                        s.setDuration(5000)

                        p.level.setStatus(p, s, true)
                    }
                }
                this.impact()

                return
            }
        }

        this.moveAct()
    }
}