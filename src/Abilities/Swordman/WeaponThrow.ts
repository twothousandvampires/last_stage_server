import Func from "../../Func";
import { ThrowedWeapon } from "../../Objects/Projectiles/ThrowedWeapon";
import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import SwordmanAbility from "./SwordmanAbility";

export default class WeaponThrow extends SwordmanAbility{
   
    light_grip: boolean
    returning: boolean
    shattering: boolean
    multiple: boolean

    constructor(owner: Swordman){
        super(owner)
        this.cd = 4000
        this.light_grip = false
        this.returning = false
        this.shattering = false
        this.name = 'weapon throw'
        this.multiple = false
    }

    canUse(): boolean {
        return this.isEnergyEnough() && !this.used && !this.owner.is_attacking
    }

    use(){
        if(this.used || this.owner.is_attacking) return

        this.owner.using_ability = this
        let cd_time = this.getCd()
       
        if(this.light_grip && Func.chance(50)){
            cd_time = Math.round(cd_time / 2)
        }

        let rel_x =  Math.round(this.owner.pressed.canvas_x + this.owner.x - 40)
        let rel_y =   Math.round(this.owner.pressed.canvas_y + this.owner.y - 40)
        
        if(rel_x < this.owner.x){
            this.owner.flipped = true
        }
        else{
            this.owner.flipped = false    
        }
        
        if(!this.owner.attack_angle){
            this.owner.attack_angle = Func.angle(this.owner.x, this.owner.y, rel_x, rel_y)
        }

        this.owner.is_attacking = true
        this.owner.state = 'attack'
        let attack_move_speed_penalty = this.owner.getAttackMoveSpeedPenalty()
        this.owner.addMoveSpeedPenalty(-attack_move_speed_penalty)

        this.owner.stateAct = this.act
        let attack_speed = this.owner.getAttackSpeed()

        this.owner.action_time = attack_speed
        this.owner.setImpactTime(80)

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.addMoveSpeedPenalty(attack_move_speed_penalty)
            this.afterUse(cd_time)
            this.owner.hit = false
            this.owner.is_attacking = false
        }
    }
    impact(){
        this.owner.level.sounds.push({
            name: 'sword swing',
            x:this.x,
            y:this.y
        })

        this.used = true

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

        proj.setAngle(this.owner.attack_angle)
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
    }
    act(){
        if(this.action && !this.hit){
            this.hit = true
            this.using_ability.impact()
        }
        else if(this.action_is_end){
            this.action_is_end = false
            this.getState()
        }
    }
}