import Func from '../Func'
import BannerOfArmourEffect from '../Objects/Effects/BannerOfArmourEffect'
import BlessedArmourStatus from './BlessedArmourStatus'
import Status from './Status'

export default class BlessedArmour extends Status {
    radius: number
    x: any
    y: any
    effect: any

    constructor(public time: number) {
        super(time)
        this.radius = 16
        this.name = 'blessed armour'
    }

    clear() {
        this.unit.level.deleted.push(this.effect.id)
        this.unit.level.binded_effects = this.unit.level.binded_effects.filter(
            elem => elem != this.effect
        )
    }

    apply(unit: any) {
        this.unit = unit

        let effect = new BannerOfArmourEffect(this.unit.level)
        effect.setOwner(this.unit)
        effect.setPoint(this.unit.x, this.unit.y)
        this.effect = effect

        unit.level.binded_effects.push(effect)
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += 1000

            let box = this.unit.getBoxElipse()
            box.r = this.radius

            this.unit.level.players.forEach(elem => {
                if (Func.elipseCollision(box, elem.getBoxElipse())) {
                    let status = new BlessedArmourStatus(tick_time)
                    status.setDuration(2000)
                    this.unit.level.setStatus(elem, status, true)
                }
            })
        }
    }
}
