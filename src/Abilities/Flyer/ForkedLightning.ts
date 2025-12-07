import Func from '../../Func'
import { ForkedLightningProjectile } from '../../Objects/Projectiles/ForkedLightningProjectile'
import Flyer from '../../Objects/src/PlayerClasses/Flyer'
import FlyerAbility from './FlyerAbility'

export default class ForkedLightning extends FlyerAbility {
    improved_chain_reaction: boolean = false
    lightning_eye: boolean = false
    fork: boolean = false

    constructor(owner: Flyer) {
        super(owner)
        this.cost = 4
        this.name = 'forked lightning'
        this.cd = 3500
        this.mastery_chance = 25
    }

    impact() {
        this.afterUse()
        this.used = true
        this.owner.level.addSound('lightning cast', this.owner.x, this.owner.y)

        let a = undefined

        let target = this.owner.getTarget()

        if (target) {
            a = Func.angle(this.owner.x, this.owner.y, target.x, target.y)
        }

        let proj = new ForkedLightningProjectile(this.owner.level)
        proj.improved_chain_reaction = this.improved_chain_reaction
        proj.lightning_eye = this.lightning_eye
        proj.fork = this.fork

        proj.setOwner(this.owner)
        if (a) {
            proj.setAngle(a)
        } else if (this.owner.attack_angle) {
            proj.setAngle(this.owner.attack_angle)
        }

        proj.setPoint(this.owner.x, this.owner.y)

        this.owner.level.projectiles.push(proj)
        this.owner.attack_angle = undefined
    }
}
