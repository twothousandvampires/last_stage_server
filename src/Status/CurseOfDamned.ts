import Character from '../Objects/src/Character'
import CurseOfDamnedEffect from '../Objects/Effects/CurseOfDamnedEffect'
import Curse from './Curse'
import CureseOfDamnedArea from '../Objects/Effects/CureseOfDamnedArea'
import Func from '../Func'
import Status from './Status'

export default class CurseOfDamned extends Status {
    effect: any

    constructor(public time: number) {
        super(time)
        this.need_to_check_resist = true
    }

    apply(unit: any) {
        this.unit = unit

        this.effect = new CurseOfDamnedEffect(this.unit.level)
        this.effect.setOwner(this.unit)

        this.unit.statusWasApplied()

        this.unit.level.binded_effects.push(this.effect)
    }

    clear() {
        if (this.unit instanceof Character) {
            let ppl = this.unit.level.players.filter(elem => {
                let d = Func.distance(elem, this.unit)
                return d <= 20
            })

            ppl.forEach(elem => {
                let s = new Curse(elem.time)
                s.setDuration(3500)
                this.unit.level.setStatus(elem, s)
            })

            let e = new CureseOfDamnedArea(this.unit.level)
            e.setPoint(this.unit.x, this.unit.y)
            this.unit.level.effects.push(e)

            this.unit.level.deleted.push(this.effect.id)
            this.unit.level.binded_effects = this.unit.level.binded_effects.filter(
                e => e != this.effect
            )
        }
    }
}
