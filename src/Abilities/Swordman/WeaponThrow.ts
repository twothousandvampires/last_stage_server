import Func from "../../Func";
import { ThrowedWeapon } from "../../Objects/Projectiles/ThrowedWeapon";
import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import Ability from "../Ability";
import SwordmanAbility from "./SwordmanAbility";

export default class WeaponThrow extends SwordmanAbility {
   
    light_grip: boolean
    returning: boolean
    shattering: boolean
    multiple: boolean

    constructor(owner: Swordman){
        super(owner)
        this.cd = 2500
        this.light_grip = false
        this.returning = false
        this.shattering = false
        this.name = 'weapon throw'
        this.multiple = false
        this.type = Ability.TYPE_ATTACK
        this.mastery_chance = 7
    }

    getCdValue(){
        let cd_time = this.cd
       
        if(this.light_grip && Func.chance(50, this.owner.is_lucky)){
            cd_time = Math.round(cd_time / 2)
        }

        return cd_time
    }

    impact(){
        this.owner.level.sounds.push({
            name: 'sword swing',
            x: this.owner.x,
            y: this.owner.y
        })

        let proj = new ThrowedWeapon(this.owner.level)
        let second = this.owner.getSecondResource()

        let is_returning = !this.shattering && this.returning && Func.chance(40 + second * 5)

        if(is_returning){
            proj.returned = true
        }
        else{
            let is_shatter = this.shattering && !this.returning && Func.chance(40 + second * 5)
            if(is_shatter){
                proj.shattered = true
            }
        }

        let target = this.owner.getTarget()

        proj.setAngle(target ? Func.angle(this.owner.x, this.owner.y, target.x, target.y) : this.owner.attack_angle)
        proj.setOwner(this.owner)
        proj.setPoint(this.owner.x, this.owner.y)

        this.owner.level.projectiles.push(proj)
    
        if(this.multiple){
            let chance = Func.chance(50 + second * 5)
            if(chance){
                let add_proj = new ThrowedWeapon(this.owner.level)
                add_proj.shattered = proj.shattered
                add_proj.returned = proj.returned

                add_proj.setAngle(proj.angle - 0.31)
                add_proj.setOwner(this.owner)
                add_proj.setPoint(this.owner.x, this.owner.y)
                this.owner.level.projectiles.push(add_proj)

                let add_proj2 = new ThrowedWeapon(this.owner.level)
                add_proj2.shattered = proj.shattered
                add_proj2.returned = proj.returned

                add_proj2.setAngle(proj.angle + 0.31)
                add_proj2.setOwner(this.owner)
                add_proj2.setPoint(this.owner.x, this.owner.y)
                this.owner.level.projectiles.push(add_proj2)
            }
        }

        this.afterUse()
    }
}