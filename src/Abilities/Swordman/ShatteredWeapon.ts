import Func from '../../Func'
import { WeaponFragment } from '../../Objects/Projectiles/WeaponFragment'
import Swordman from '../../Objects/src/PlayerClasses/Swordman'
import Ability from '../Ability'
import SwordmanAbility from './SwordmanAbility'

export default class ShatteredWeapon extends SwordmanAbility {

    sharp_fragments: boolean = false
    shrapnel: boolean = false
    
    constructor(owner: Swordman) {
        super(owner)
        this.name = 'shattered weapon'
        this.cost = 4
        this.cd = 5000
        this.type = Ability.TYPE_ATTACK
        this.mastery_chance = 20
    }

    impact() {
        let second = this.owner.getSecondResource()

        let a = undefined
        let target = this.owner.getTarget()

        if (target) {
            a = Func.angle(this.owner.x, this.owner.y, target.x, target.y)
        }
        a = a ? a : this.owner.attack_angle

        if(!a){
            return
        }

        let count = 3 + (Math.round(second / 2))

        let u = 0
        let d = 0

        for (let i = 0; i <count; i++) {
            let l = new WeaponFragment(this.owner.level)

            l.sharp_fragments = this.sharp_fragments
            l.shrapnel = this.shrapnel

            l.setPoint(this.owner.x + Math.sin(a) * 2, this.owner.y + Math.cos(a) * 2)
            l.setOwner(this.owner)

            if (i === 0) {
                l.setAngle(a)
            } else if (i % 2 === 0) {
                u += 0.5
                l.setAngle(a - u)
            } else {
                d += 0.5
                l.setAngle(a + d)
            }

            this.owner.level.projectiles.push(l)
        }

        this.afterUse()
    }
}
