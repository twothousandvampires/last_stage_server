import Func from "../../Func";
import { ThrowedWeapon } from "../../Objects/Projectiles/ThrowedWeapon";
import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import SwordmanAbility from "./SwordmanAbility";

export default class WeaponThrow extends SwordmanAbility{
    cd: boolean
    light_grip: boolean
    returning: boolean
    shattering: boolean
    multiple: boolean

    constructor(owner: Swordman){
        super(owner)
        this.cd = false
        this.light_grip = false
        this.returning = false
        this.shattering = false
        this.name = 'weapon throw'
        this.multiple = true
    }

    canUse(): boolean {
        return !this.cd
    }

    use(){
        if(this.cd) return 

        this.cd = true

        let cd_time = 4000

        if(this.light_grip && Func.chance(50)){
            cd_time = Math.round(cd_time / 2)
        }

        setTimeout(()=>{
            this.cd = false
        }, cd_time)

        let rel_x =  Math.round(this.owner.pressed.canvas_x + this.owner.x - 40)
        let rel_y =   Math.round(this.owner.pressed.canvas_y + this.owner.y - 40)
        
        if(rel_x < this.owner.x){
            this.owner.flipped = true
        }
        else{
            this.owner.flipped = false    
        }
        
        this.owner.attack_angle = Func.angle(this.owner.x, this.owner.y, rel_x, rel_y)

        this.owner.is_attacking = true
        this.owner.state = 'attack'
        let attack_move_speed_penalty = this.owner.getAttackMoveSpeedPenalty()
        this.owner.addMoveSpeedPenalty(-attack_move_speed_penalty)

        this.owner.stateAct = this.act
        let attack_speed = this.owner.getAttackSpeed()

        this.owner.action_time = attack_speed

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.addMoveSpeedPenalty(attack_move_speed_penalty)

            setTimeout(()=>{
                this.owner.hit = false
                this.owner.is_attacking = false
            },50)
        }

        this.owner.setTimerToGetState(attack_speed)
    }

    act(){
        if(this.action && !this.hit){
            this.level.sounds.push({
                name: 'sword swing',
                x:this.x,
                y:this.y
            })
            
            this.hit = true
        
            let proj = new ThrowedWeapon(this.level)
            let second = this.getSecondResource()

            let is_returning = !this.first_ab.shattering && this.first_ab.returning && Func.chance(40 + second * 5)

            if(is_returning){
                proj.returned = true
            }
            else{
                let is_shatter = this.first_ab.shattering && !this.first_ab.returning && Func.chance(40 + second * 5)
                if(is_shatter){
                    proj.shattered = true
                }
            }

            proj.setAngle(this.attack_angle)
            proj.setOwner(this)
            proj.setPoint(this.x, this.y)

            this.level.projectiles.push(proj)
        
            if(this.first_ab.multiple){
                let chance = Func.chance(50 + second * 5)
                if(chance){
                    let add_proj = new ThrowedWeapon(this.level)
                    add_proj.shattered = proj.shattered
                    add_proj.returned = proj.returned

                    add_proj.setAngle(proj.angle - 0.31)
                    add_proj.setOwner(this)
                    add_proj.setPoint(this.x, this.y)
                    this.level.projectiles.push(add_proj)


                    let add_proj2 = new ThrowedWeapon(this.level)
                    add_proj2.shattered = proj.shattered
                    add_proj2.returned = proj.returned

                    add_proj2.setAngle(proj.angle + 0.31)
                    add_proj2.setOwner(this)
                    add_proj2.setPoint(this.x, this.y)
                    this.level.projectiles.push(add_proj2)
                }
            }
        }
    }
}