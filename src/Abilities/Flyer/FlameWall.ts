import Func from '../../Func'
import { FlameWallObject } from '../../Objects/Projectiles/FlameWallObject'
import Flyer from '../../Objects/src/PlayerClasses/Flyer'
import FlyerAbility from './FlyerAbility'

export default class FlameWall extends FlyerAbility {
    scorching: boolean
    frendly_flame: boolean

    constructor(owner: Flyer) {
        super(owner)
        this.cost = 4
        this.scorching = false
        this.frendly_flame = false
        this.name = 'flamewall'
        this.cd = 4000
        this.mastery_chance = 45
    }

    impact() {
        this.afterUse()
        this.used = true

        this.owner.level.addSound('fire massive', this.owner.x, this.owner.y)
        let angles = [0, 0.79, 1.57, 2.36, 3.14, 3.93, 4.71, 5.5]

        angles.forEach(a => {
            let l = 1 - Math.abs(0.5 * Math.cos(a))

            let n_x = Math.sin(a) * l * 18
            let n_y = Math.cos(a) * l * 18

            let flame = new FlameWallObject(this.owner.level, this.scorching ? 450 : 900, 5000)
            flame.frendly_flame = this.frendly_flame

            flame.setOwner(this.owner)
            flame.setPoint(this.owner.x + n_x, this.owner.y + n_y)
            this.owner.level.projectiles.push(flame)
        })
    }
}
