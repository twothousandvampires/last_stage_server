import Func from '../../Func'
import { ThrowedWeapon } from '../../Objects/Projectiles/ThrowedWeapon'
import Swordman from '../../Objects/src/PlayerClasses/Swordman'
import Ability from '../Ability'
import SwordmanAbility from './SwordmanAbility'

export default class WeaponThrow extends SwordmanAbility {
    light_grip: boolean = false
    returning: boolean = false
    shattering: boolean = false
    multiple: boolean = false

    constructor(owner: Swordman) {
        super(owner)
        this.cd = 2500
        this.name = 'weapon throw'
        this.type = Ability.TYPE_ATTACK
        this.mastery_chance = 7
    }

    getCdValue() {
        let cd_time = this.cd

        if (this.light_grip && Func.chance(50, this.owner.is_lucky)) {
            cd_time = Math.round(cd_time / 2)
        }

        return cd_time
    }

    impact() {
        this.owner.level.sounds.push({
            name: 'sword swing',
            x: this.owner.x,
            y: this.owner.y,
        })

        let proj = new ThrowedWeapon(this.owner.level)
        let second = this.owner.getSecondResource()

        let is_returning = !this.shattering && this.returning && Func.chance(40 + second * 5)
        let is_shatter = false
        
        if (is_returning) {
            proj.returned = true
        } else {
            is_shatter = this.shattering && !this.returning && Func.chance(40 + second * 5)
            if (is_shatter) {
                proj.shattered = true
            }
        }

        let target = this.owner.getTarget()

        let a = target ? Func.angle(this.owner.x, this.owner.y, target.x, target.y) : this.owner.attack_angle

        proj.setAngle(a)
            
        proj.setOwner(this.owner)
        proj.setPoint(this.owner.x, this.owner.y)

        this.owner.level.projectiles.push(proj)

        if (this.multiple) {
            let count  = Func.random(1, 2 + Math.floor(second / 5))
          
            let u = 0
            let d = 0
    
            for (let i = 1; i <= count; i++) {
                let add_proj = new ThrowedWeapon(this.owner.level)
                add_proj.setOwner(this.owner)
                add_proj.setPoint(this.owner.x, this.owner.y)
                add_proj.returned = is_returning
                add_proj.shattered = is_shatter

                if (i % 2 === 0) {
                    u += 0.5
                    add_proj.setAngle(a - u)
                } else {
                    d += 0.5
                    add_proj.setAngle(a + d)
                }
    
                this.owner.level.projectiles.push(add_proj)     
            }
        }

        this.afterUse()
    }
}
