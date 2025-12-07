import Func from '../Func'
import MetalThornsEffect from '../Objects/Effects/MetalThornsEffect'
import Status from './Status'

export default class MetalThornsStatus extends Status {
    pointed: boolean = false

    radius: number
    frequency: number
    x: any
    y: any
    effect: any
    drained: number = 0

    constructor(public time: number) {
        super(time)
        this.radius = 12
        this.name = 'metal thorns'
        this.frequency = 1000
    }

    clear() {
        this.unit.armour_rate -= 10
        this.unit.armour_rate += this.drained

        this.unit.level.deleted.push(this.effect.id)
        this.unit.level.binded_effects = this.unit.level.binded_effects.filter(
            elem => elem != this.effect
        )
    }

    setRadius(radius: number) {
        this.radius = radius
    }

    setFrequency(frequency: number) {
        this.frequency = frequency
        if (this.frequency < 200) {
            this.frequency = 200
        }
    }

    apply(unit: any) {
        this.unit = unit
        this.unit.armour_rate += 10

        let effect = new MetalThornsEffect(this.unit.level)
        effect.setOwner(this.unit)
        effect.setPoint(this.unit.x, this.unit.y)

        this.effect = effect

        unit.level.binded_effects.push(effect)
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += this.frequency
            if (!this.unit) return

            if (Func.notChance(this.unit.armour_rate, this.unit.is_lucky)) return

            let box = this.unit.getBoxElipse()
            box.r = this.radius

            this.drained++
            this.unit.armour_rate--

            this.unit.level.enemies.forEach(elem => {
                if (Func.elipseCollision(box, elem.getBoxElipse())) {
                    elem.takeDamage(this.unit)
                    if (this.pointed) {
                        elem.crushing++
                    }
                }
            })

            this.unit.level.players.forEach(elem => {
                if (elem != this.unit && Func.elipseCollision(box, elem.getBoxElipse())) {
                    elem.takeDamage(this.unit)
                }
            })
        }
    }
}
