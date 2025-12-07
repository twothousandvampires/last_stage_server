import Func from '../../Func'
import Level from '../../Level'
import Curse from '../../Status/Curse'
import Curse2 from '../../Status/Curse2'
import Despair from '../../Status/Despair'
import Projectiles from './Projectiles'

export class EvilSpirit extends Projectiles {
    w: number
    start_x: number | undefined
    start_y: number | undefined
    max_distance: number
    target: any

    constructor(level: Level) {
        super(level)
        this.box_r = 0.6
        this.name = 'curse of damned'
        this.move_speed = 0.35
        this.w = 3
        this.max_distance = 35
    }

    setPoint(x: number = 0, y: number = 0): void {
        this.start_x = x
        this.start_y = y
        this.x = x
        this.y = y
    }

    act(): void {
        this.level.players.forEach(elem => {
            if (Func.elipseCollision(this.getBoxElipse(), elem.getBoxElipse())) {
                if (elem.isBlock()) {
                    elem.succesefulBlock(this.owner)
                } else {
                    let r = Func.random(1, 3)
                    if (r === 1) {
                        let status = new Curse(elem.level.time)
                        status.setDuration(6000)

                        this.level.setStatus(elem, status)
                    } else if (r === 2) {
                        let status = new Despair(elem.level.time)
                        status.setDuration(6000)

                        this.level.setStatus(elem, status, true)
                    } else if (r === 3) {
                        let status = new Curse2(elem.level.time)
                        status.setDuration(6000)

                        this.level.setStatus(elem, status, true)
                    }
                }

                this.impact()
            }
        })

        let traveled = Math.sqrt((this.x - this.start_x) ** 2 + (this.y - this.start_y) ** 2)

        if (traveled >= this.max_distance) {
            this.impact()
            return
        }

        if (!this.target) {
            this.target = this.level.players.filter(elem => Func.distance(this, elem) <= 8)[0]
        }

        if (this.target) {
            this.angle = Func.angle(this.x, this.y, this.target.x, this.target.y)
        }

        this.moveAct()
    }
}
