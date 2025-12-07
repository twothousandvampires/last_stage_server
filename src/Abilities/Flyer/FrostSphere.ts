import Func from '../../Func'
import { FrostSphereProjectile } from '../../Objects/Projectiles/FrostSphereProjectile'
import Flyer from '../../Objects/src/PlayerClasses/Flyer'
import FlyerAbility from './FlyerAbility'

export default class FrostSphere extends FlyerAbility {
    frost_rich: boolean = false
    reign_of_frost: boolean = false
    icicles: boolean = false
    ice: boolean = false
    shattering: boolean = false

    constructor(owner: Flyer) {
        super(owner)
        this.cost = 1
        this.name = 'frost sphere'
        this.mastery_chance = 4
    }

    impact() {
        this.afterUse()
        this.owner.level.addSound('cold cast', this.owner.x, this.owner.y)
        let a = undefined

        let target = this.owner.getTarget()
        if (target) {
            a = Func.angle(this.owner.x, this.owner.y, target.x, target.y)
        }

        this.owner.target = undefined

        let proj = new FrostSphereProjectile(this.owner.level)
        proj.frost_rich = this.frost_rich
        proj.reign_of_frost = this.reign_of_frost
        proj.ice = this.ice
        proj.shattering = this.shattering
        if (this.icicles) {
            proj.icicles_count = this.owner.getSecondResource()
        }
        proj.setOwner(this.owner)
        proj.setAngle(a ? a : this.owner.attack_angle)
        proj.setPoint(this.owner.x, this.owner.y)

        this.owner.level.projectiles.push(proj)
    }
}
