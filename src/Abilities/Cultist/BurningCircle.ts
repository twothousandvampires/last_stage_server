import Cultist from '../../Objects/src/PlayerClasses/Cultist'
import BurningCircleStatus from '../../Status/BurningCircleStatus'
import CultistAbility from './CultistAbility'

export default class BurningCircle extends CultistAbility {
    consuming: boolean
    hatred: boolean
    devouring: boolean

    constructor(owner: Cultist) {
        super(owner)
        this.name = 'burning circle'
        this.cost = 5
        this.consuming = false
        this.hatred = false
        this.devouring = false
        this.cd = 25000
        this.mastery_chance = 50
    }

    impact() {
        this.owner.level.sounds.push({
            name: 'fire cast',
            x: this.owner.x,
            y: this.owner.y,
        })

        let status = new BurningCircleStatus(this.owner.level.time)
        let second = this.owner.getSecondResource()
        status.setFrequency(1800 - second * 150)

        status.setDuration(8000)

        if (this.consuming) {
            status.setRadius(16)
        }

        if (this.hatred) {
            status.hatred = true
        }

        status.devouring = this.devouring

        this.owner.level.setStatus(this.owner, status, true)
        this.afterUse()
    }
}
