import Func from '../../Func'
import { FireballProjectile } from '../../Objects/Projectiles/FireballProjectile'
import Flyer from '../../Objects/src/PlayerClasses/Flyer'
import FlyerAbility from './FlyerAbility'

export default class Fireball extends FlyerAbility {
    body_melting: boolean = false
    ignite: boolean = false
    fire_splitting: boolean = false

    constructor(owner: Flyer) {
        super(owner)
        this.cost = 1
        this.name = 'fireball'
        this.mastery_chance = 4
    }

    impact() {
        this.afterUse()
        this.owner.level.addSound('fire cast', this.owner.x, this.owner.y)

        let a = undefined
        let target = this.owner.getTarget()

        if (target) {
            a = Func.angle(this.owner.x, this.owner.y, target.x, target.y)
        }

        a = a ? a : this.owner.attack_angle

        let proj = new FireballProjectile(this.owner.level, this.body_melting)
        proj.ignite = this.ignite
        proj.setOwner(this.owner)
        proj.setAngle(a)
        proj.setPoint(this.owner.x, this.owner.y)

        this.owner.level.projectiles.push(proj)

        if (this.fire_splitting) {

            let u = 0
            let d = 0

            let count = Math.floor(this.owner.getSecondResource() / 2)
    
            for (let i = 1; i <= count; i++) {
                let proj = new FireballProjectile(this.owner.level, this.body_melting)
     
                if (i % 2 === 0) {
                    u += 0.5
                    proj.setAngle(a - u)
                } else {
                    d += 0.5
                    proj.setAngle(a + d)
                }
                
                proj.ignite = this.ignite
                proj.setOwner(this.owner)
                proj.setPoint(this.owner.x, this.owner.y)

                this.owner.level.projectiles.push(proj)
            }
        }
    }
}
