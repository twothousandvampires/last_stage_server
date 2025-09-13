import Func from "../../Func";
import { SoulShatterProj } from "../../Objects/Projectiles/SoulShatterProj";
import Cultist from "../../Objects/src/PlayerClasses/Cultist";
import CultistAbility from "./CultistAbility";

export default class SoulShatter extends CultistAbility{

    constructor(owner: Cultist){
        super(owner)
        this.name = 'soul shatter'
    }

    canUse(): boolean {
        return !this.owner.is_attacking && this.owner.can_attack
    } 

    use(){

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
        this.owner.state = 'attack'
        this.owner.addMoveSpeedPenalty(-70)

        this.owner.stateAct = this.act
        let attack_speed = this.owner.getAttackSpeed()

        this.owner.action_time = attack_speed

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.addMoveSpeedPenalty(70)

            this.owner.hit = false
            this.owner.is_attacking = false
            this.owner.hit_x = undefined
            this.owner.hit_y = undefined
        
        }
    }

    act(){
        if(this.action && !this.hit){
            this.hit = true
        
            let enemies = this.level.enemies
            let players = this.level.players 

            let rel_distance = Math.sqrt(((this.x - this.c_x) ** 2) + ((this.y - this.c_y) ** 2))

            let distance = rel_distance > this.attack_radius ? this.attack_radius : rel_distance
            
            let hit_x = this.x + (Math.sin(this.attack_angle) * distance)
            let hit_y = this.y + (Math.cos(this.attack_angle) * distance)

            let r = this.getBoxElipse()
            r.r = this.attack_point_radius
            r.x = hit_x
            r.y = hit_y

            this.level.sounds.push({
                name:'blow',
                x: this.x,
                y: this.y
            })

            let f = enemies.filter(elem => Func.elipseCollision(r, elem.getBoxElipse()))

            f.sort((a, b) => Func.distance(this, a) - Func.distance(this, b))

            let t = f[0]
           
            if(t){
                if(Func.chance(50 + this.getSecondResource() * 5)){
                    t.takeDamage(this, {
                        explode: true
                    })

                    if(t.is_dead){
                        let count = 3 + this.getSecondResource()
                        let zones = 6.28 / count
                
                        for(let i = 1; i <= count; i++){
                            let min_a = (i - 1) * zones
                            let max_a = i * zones
                
                            let angle = Math.random() * (max_a - min_a) + min_a

                            let proj = new SoulShatterProj(this.level)
                            proj.setStart(this.time)
                            proj.setAngle(angle)
                            proj.setPoint(t.x, t.y)
                            proj.setOwner(this)
                
                            this.level.projectiles.push(proj)
                        }
                    }
                }
                else{
                    t.takeDamage(this)
                }
             
            }
          
            this.target = undefined
            this.attack_angle = undefined
        }
        else if(this.action_is_end){
            this.action_is_end = false
            this.getState()
        }
    }
}