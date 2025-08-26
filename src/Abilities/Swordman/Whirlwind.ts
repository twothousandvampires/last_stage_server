import Func from "../../Func";
import Blood from "../../Objects/Effects/Blood";
import BloodSphere from "../../Objects/Effects/BloodSphere";
import { ThrowedWeapon } from "../../Objects/Projectiles/ThrowedWeapon";
import Swordman from "../../Objects/src/PlayerClasses/Swordman";
import SwordmanAbility from "./SwordmanAbility";
import WeaponThrow from "./WeaponThrow";

export default class Whirlwind extends SwordmanAbility{
    cost: number
    blood_harvest: boolean
    fan_of_swords: boolean

    constructor(owner: Swordman){
        super(owner)
        this.cost = 7
        this.blood_harvest = false
        this.fan_of_swords = false
        this.name = 'whirlwind'
    }

    canUse(){
        return this.owner.resource >= this.cost
    }

    afterUse(){
        this.owner.use_not_utility_triggers.forEach(elem => {
                elem.trigger(this.owner)
        })
        this.owner.resource -= this.cost
        this.owner.second_ability.used = false
        this.owner.last_skill_used_time = this.owner.time
        
    }

    use(echo = false){
        if(this.owner.is_attacking && !echo) return

        let action_time = this.owner.attack_speed / 2

        if(!echo){
            this.owner.is_attacking = true
            this.owner.state = 'swing'

            this.owner.stateAct = this.act
            this.owner.action_time = action_time

            this.owner.cancelAct = () => {
                this.owner.is_attacking = false
                this.owner.action = false
                this.owner.hit = false
            }
        }
        else{
            this.owner.hit = false
            this.owner.action = false
        }
       
        if(Func.chance(this.owner.getSecondResource() * 10)){
            setTimeout(() => {
               this.use(true)
            }, action_time)
        }
        else{
            this.owner.setTimerToGetState(action_time)
        }   
    }

    act(){
        if(this.action && !this.hit){
            this.hit = true

            let second = this.getSecondResource()
           
            let enemies = this.level.enemies
            let players = this.level.players

            let targets = enemies.concat(players)

            let e = this.getBoxElipse()
            e.r += 5 + Math.ceil(second / 2)

            let was_hit = false

            let kill_count = 0
    
            targets.forEach(elem => {
                if(elem != this && Func.elipseCollision(e, elem.getBoxElipse())){
                    was_hit = true
                    elem.takeDamage(this)
                    this.level.sounds.push(elem.getWeaponHitedSound())
                    if(elem.is_dead){
                        kill_count ++

                        for(let i = 0; i < 2;i++){
                            let e = new Blood(this.level)
                            e.setPoint(elem.x, elem)
                            this.level.effects.push(e)
                        }                       
                    }
                }
            })

            if(this.third_ability.blood_harvest && kill_count > 0){
                let chance = 20 * kill_count
                if(Func.chance(chance)){
                    let sphere = new BloodSphere(this.level, kill_count)
                    sphere.setPoint(this.x, this.y)
                    this.level.binded_effects.push(sphere)
                }
            }
            
            if(!was_hit){
                this.level.sounds.push({
                    name: 'sword swing',
                    x:this.x,
                    y:this.y
                })
            }

            if(this.third_ability.fan_of_swords){
                let count = this.getTargetsCount()
                
                let zones = 6.28 / count
        
                for(let i = 1; i <= count; i++){
                    let min_a = (i - 1) * zones
                    let max_a = i * zones
        
                    let angle = Math.random() * (max_a - min_a) + min_a
                    let proj = new ThrowedWeapon(this.level)

                    if(this.first_ability instanceof WeaponThrow){
                        if(this.first_ability.shattering){
                            proj.shattered = true
                        }
                        else if(this.first_ability.returning){
                            proj.returned = true
                        }
                    }

                    proj.point_added = true
                    proj.setAngle(angle)
                    proj.setPoint(this.x, this.y)
                    proj.setOwner(this)
        
                    this.level.projectiles.push(proj)
                }
            }
        }
    }
}