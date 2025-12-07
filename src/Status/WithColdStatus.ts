import Func from '../Func'
import FrostExplosionBig from '../Objects/Effects/FrostExplosionBig'
import Status from './Status'

export default class WithColdStatus extends Status {
    last_checked: number
    name: string

    constructor(public time: number) {
        super(time)
        this.last_checked = time
        this.name = 'with cold status'
    }

    apply(unit: any) {
        this.unit = unit
    }

    update(status: any) {
        this.power++
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += 6000

            let check_distance = 14

            let area = this.unit.getBoxElipse()
            area.r = check_distance

            let targets = this.unit.level.enemies.filter(elem =>
                Func.elipseCollision(elem.getBoxElipse(), area)
            )
            let random_target = targets[Math.round(Math.random() * targets.length)]

            if (random_target) {
                let e = new FrostExplosionBig(this.unit.level)
                e.setPoint(random_target.x, random_target.y)
                this.unit.level.effects.push(e)

                let enemies = this.unit.level.enemies
                let players = this.unit.level.players

                let point = random_target.getBoxElipse()
                point.r = 7

                enemies.forEach(elem => {
                    if (Func.elipseCollision(point, elem.getBoxElipse())) {
                        elem.setFreeze(1500)
                    }
                })

                players.forEach(elem => {
                    if (elem != this.unit && Func.elipseCollision(point, elem.getBoxElipse())) {
                        elem.setFreeze(1500)
                    }
                })
            }
        }
    }
}
