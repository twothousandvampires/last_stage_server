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
        this.owner.useNotUtilityTriggers.forEach(elem => {
                elem.trigger(this.owner)
        })
        this.owner.resource -= this.cost
        this.owner.second_ab.used = false
        this.owner.last_skill_used_time = this.owner.time
        
    }

    use(){
        if(this.owner.is_attacking) return

        this.owner.is_attacking = true
        this.owner.state = 'swing'
        this.owner.can_move_by_player = false

        this.owner.stateAct = this.act

        this.owner.cancelAct = () => {
            this.owner.is_attacking = false
            this.owner.action = false
            this.owner.can_move_by_player = true
            this.owner.hit = false
        }
        
        this.owner.setTimerToGetState(this.owner.attack_speed / 2)
    }

    act(){
        if(this.action && !this.hit){
            this.hit = true

            let second = this.getSecondResource()
            let to_damage_count = this.getTargetsCount() * 2

            let enemies = this.level.enemies
            let players = this.level.players

            let targets = enemies.concat(players)

            let e = this.getBoxElipse()
            e.r += 5 + Math.ceil(second / 2)

            let was_hit = false

            let kill_count = 0
    
            targets.forEach(elem => {
                if(to_damage_count > 0 && elem != this && Func.elipseCollision(e, elem.getBoxElipse())){
                    was_hit = true
                    elem.takeDamage(this)
                    to_damage_count--
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

            if(this.third_ab.blood_harvest && kill_count > 0){
                let chance = 20 * kill_count
                if(Func.chance(chance)){
                    let sphere = new BloodSphere(this.level, kill_count)
                    sphere.setPoint(this.x, this.y)
                    this.level.bindedEffects.push(sphere)
                }
            }
            
            if(!was_hit){
                this.level.sounds.push({
                    name: 'sword swing',
                    x:this.x,
                    y:this.y
                })
            }

            if(this.third_ab.fan_of_swords){
                let count = to_damage_count / 2
                
                let zones = 6.28 / count
        
                for(let i = 1; i <= count; i++){
                    let min_a = (i - 1) * zones
                    let max_a = i * zones
        
                    let angle = Math.random() * (max_a - min_a) + min_a
                    let proj = new ThrowedWeapon(this.level)

                    if(this.first_ab instanceof WeaponThrow){
                        if(this.first_ab.shattering){
                            proj.shattered = true
                        }
                        else if(this.first_ab.returning){
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