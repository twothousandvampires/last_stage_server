import Func from "../../Func";
import { WeaponFragment } from "../../Objects/Projectiles/WeaponFragment";
import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import SwordmanAbility from "./SwordmanAbility";

export default class ShatteredWeapon extends SwordmanAbility{
    used: boolean

    constructor(owner: Swordman){
        super(owner)
        this.used = false
        this.name = 'shattered weapon'
        this.cost = 4
    }

    canUse(): boolean {
        return !this.used && this.owner.resource >= this.cost
    }

    use(){
        if(this.owner.is_attacking) return

        this.owner.is_attacking = true
        this.used = true

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

            let second = this.getSecondResource()
            this.hit = true
        
            let a = undefined                    
            let target = this.getTarget()
            
            if(target){
                a = Func.angle(this.x, this.y, target.x, target.y)
            }

            a = a ? a : this.attack_angle

            let count = 3 + Math.round(second / 3)
            let zone_per_tooth = 0.6
            
            a -= (Math.round(count / 2) * zone_per_tooth)

            for (let i = 1; i <= count; i++){
                let min_a = a + ((i - 1) * zone_per_tooth)
                let max_a = a + (i * zone_per_tooth)
    
                let angle = Math.random() * (max_a - min_a) + min_a
                let proj = new WeaponFragment(this.level)
                proj.setAngle(angle)
                proj.setPoint(this.x, this.y)
                proj.setOwner(this)
    
                this.level.projectiles.push(proj)
            }
        }
    }
}