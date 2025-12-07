import StaticFiledEffect from '../../Objects/Effects/StaticFiled'
import Flyer from '../../Objects/src/PlayerClasses/Flyer'
import FlyerAbility from './FlyerAbility'

export default class StaticField extends FlyerAbility {
    hand_cuffing: boolean
    collapse: boolean

    constructor(owner: Flyer) {
        super(owner)
        this.cd = 10000
        this.name = 'static field'
        this.hand_cuffing = false
        this.collapse = false
        this.mastery_chance = 10
    }

    impact() {
        this.afterUse()
        this.used = true

        this.owner.level.addSound('cast', this.owner.x, this.owner.y)

        let e = new StaticFiledEffect(this.owner.level)
        e.hand_cuffing = this.hand_cuffing
        e.collapse = this.collapse

        e.setPoint(this.owner.c_x, this.owner.c_y)
        this.owner.level.binded_effects.push(e)
    }
}
