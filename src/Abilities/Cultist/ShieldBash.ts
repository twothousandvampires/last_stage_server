import Func from "../../Func";
import { Bone } from "../../Objects/Projectiles/Bone";
import Cultist from "../../Objects/src/PlayerClasses/Cultist";
import CultistAbility from "./CultistAbility";

export default class ShieldBash extends CultistAbility{

    deafening_wave: boolean
    hate: boolean
    coordination: boolean

    constructor(owner: Cultist){
        super(owner)
        this.name = 'shield bash'
        this.deafening_wave = false
        this.hate = false
        this.coordination = false
        this.cost = 4
        this.cd = 5000
    }

    canUse(): boolean {
        return this.owner.resource >= this.cost && this.owner.can_attack && !this.used
    }

    use(){
        if(this.owner.is_attacking) return
       
        let rel_x = Math.round(this.owner.pressed.canvas_x + this.owner.x - 40)
        let rel_y = Math.round(this.owner.pressed.canvas_y + this.owner.y - 40)
        
        this.owner.c_x = rel_x
        this.owner.c_y = rel_y  

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
        this.owner.state = 'shield hit'
        let move_speed_reduce = this.owner.getMoveSpeedReduceWhenUseSkill()
        this.owner.addMoveSpeedPenalty(-move_speed_reduce)

        this.owner.stateAct = this.act
        let attack_speed = this.owner.getAttackSpeed()

        if(this.coordination){
            attack_speed = attack_speed / 1.5
        }

        this.owner.action_time = attack_speed

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.addMoveSpeedPenalty(move_speed_reduce)

            setTimeout(()=>{
                this.owner.hit = false
                this.owner.is_attacking = false
                this.owner.hit_x = undefined
                this.owner.hit_y = undefined
            },50)
        }

        this.owner.setTimerToGetState(attack_speed)
    }

    act(){
        if(this.action && !this.hit){
            this.hit = true
            let second_resource = this.getSecondResource()
        
            let enemies = this.level.enemies
            let players = this.level.players 
            let attack_elipse = this.getBoxElipse()

            attack_elipse.r = 8

            let f = enemies.filter(elem => Func.checkAngle(this, elem, this.attack_angle, this.weapon_angle))
            let p = players.filter(elem => Func.checkAngle(this, elem, this.attack_angle, this.weapon_angle))
            let filtered_to_damage = f.filter(elem => Func.elipseCollision(attack_elipse, elem.getBoxElipse()))
            let filtered_to_damage_players = p.filter(elem => Func.elipseCollision(attack_elipse, elem.getBoxElipse()))

            this.target = undefined
         
            filtered_to_damage.concat(filtered_to_damage_players).forEach(elem => {
                if(this.second_ability.hate && Func.chance(40)){

                    elem.takeDamage(this, {
                        explode: true
                    })

                    if(elem.is_dead){
                        let count = Func.random(1, 1 + second_resource)
                        
                        let zones = 6.28 / count
                
                        for(let i = 1; i <= count; i++){
                            let min_a = (i - 1) * zones
                            let max_a = i * zones
                
                            let angle = Math.random() * (max_a - min_a) + min_a
                            let proj = new Bone(this.level)
                            proj.setAngle(angle)
                            proj.setPoint(elem.x, elem.y)
                
                            this.level.projectiles.push(proj)
                        }
                    }
                }
                else{
                    elem.takeDamage(this)
                }   
            })

            if(!this.second_ability.hate){
                let stan_duration = this.second_ability.deafening_wave ? 3000 : 2000
                stan_duration += second_resource * 100
                attack_elipse.r = 12

                if(this.second_ability.deafening_wave){
                    attack_elipse.r += 8
                }
                let filtered_to_stun = f.filter(elem => Func.elipseCollision(attack_elipse, elem.getBoxElipse()))
                filtered_to_stun.forEach(elem => {
                    if(!elem.is_dead){
                        elem.setStun(stan_duration)
                    }
                })
            }

            this.level.sounds.push({
                name:'ground hit',
                x: this.x,
                y: this.y
            })

            this.attack_angle = undefined
            this.afterUseSecond()

            if(this.second_ability.used === true && this.second_ability.coordination && Func.chance(30)){
                this.second_ability.used = false
            }
        }
    }
}