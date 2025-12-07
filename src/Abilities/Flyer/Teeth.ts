import Func from '../../Func'
import { Tooth } from '../../Objects/Projectiles/Tooth'
import Flyer from '../../Objects/src/PlayerClasses/Flyer'
import FlyerAbility from './FlyerAbility'

export default class Teeth extends FlyerAbility {
    pulling: boolean = false
    sharp: boolean = false

    constructor(owner: Flyer) {
        super(owner)
        this.cost = 1
        this.name = 'teeth'
        this.cd = 2000
        this.mastery_chance = 7
    }

    impact() {
        this.afterUse()
        this.used = true

        this.owner.level.addSound('cast', this.x, this.y)

        let a = undefined
        let target = this.owner.getTarget()

        if (target) {
            a = Func.angle(this.owner.x, this.owner.y, target.x, target.y)
        }

        a = a ? a : this.owner.attack_angle

        let count = 3 + this.owner.getAdditionalRadius()

        if (this.pulling) {
            count += this.owner.level.enemies.filter(
                elem => elem.is_dead && Func.distance(elem, this.owner) <= 16
            ).length
        }

        if (count > 30) {
            count = 30
        }

        let zone_per_tooth = 0.2

        a -= Math.round(count / 2) * zone_per_tooth

        for (let i = 1; i <= count; i++) {
            let min_a = a + (i - 1) * zone_per_tooth
            let max_a = a + i * zone_per_tooth

            let angle = Math.random() * (max_a - min_a) + min_a
            let proj = new Tooth(this.owner.level, this.sharp)
            proj.setAngle(angle)
            proj.setPoint(this.owner.x, this.owner.y)

            this.owner.level.projectiles.push(proj)
        }
    }
}
