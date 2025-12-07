import Swordman from '../../Objects/src/PlayerClasses/Swordman'
import HeavenWrathStatus from '../../Status/HeavenWrathStatus'
import SwordmanAbility from './SwordmanAbility'

export default class HeavenWrath extends SwordmanAbility {
    call: boolean = false

    constructor(owner: Swordman) {
        super(owner)
        this.name = 'heaven wrath'
        this.cost = 9
        this.need_to_pay = true
        this.mastery_chance = 50
        this.cd = 5000
    }

    impact() {
        let second = this.owner.getSecondResource()
        this.owner.level.sounds.push({
            name: 'holy cast',
            x: this.owner.x,
            y: this.owner.y,
        })

        let frequency = this.owner.getAttackSpeed()
        if (frequency < 100) {
            frequency = 100
        }
        frequency = Math.round(frequency / 2)
        let s = new HeavenWrathStatus(this.owner.level.time, frequency)
        s.setDuration(8000 + second * 500)

        this.owner.level.setStatus(this.owner, s)

        this.afterUse()
    }
}
