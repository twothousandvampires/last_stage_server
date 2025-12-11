import Swordman from '../../Objects/src/PlayerClasses/Swordman'
import CursedWeaponStatus from '../../Status/CursedWeaponStatus'
import SwordmanAbility from './SwordmanAbility'

export default class CursedWeapon extends SwordmanAbility {
    drinker: boolean = false

    constructor(owner: Swordman) {
        super(owner)
        this.name = 'cursed weapon'
        this.cd = 12000
        this.mastery_chance = 15
    }

    impact() {
        this.afterUse()

        let second = this.owner.getSecondResource()

        let status = new CursedWeaponStatus(this.owner.level.time, this.drinker)
        status.setDuration(8000 + (second * 200))

        this.owner.level.setStatus(this.owner, status)

        this.owner.level.sounds.push({
            name: 'dark cast',
            x: this.owner.x,
            y: this.owner.y,
        })
    }
}
