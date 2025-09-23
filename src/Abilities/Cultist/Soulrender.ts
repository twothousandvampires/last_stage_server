import Cultist from "../../Objects/src/PlayerClasses/Cultist";
import CultistAbility from "./CultistAbility";
import RuneEffect from "../../Objects/Effects/Rune";
import Func from "../../Func";
import Soul from "../../Objects/Effects/Soul";
import { SoulShatterProj } from "../../Objects/Projectiles/SoulShatterProj";

export default class Soulrender extends CultistAbility{

    distance: number
    count: number = 0

    constructor(owner: Cultist){
        super(owner)
        this.name = 'soulrender'
        this.distance = 25
    }

    canUse(): boolean {
        return this.isEnergyEnough() && !this.used && this.owner.can_cast && !this.owner.is_attacking
    }

    impact(){
        let rel_distance = Math.sqrt(((this.owner.x - this.owner.c_x) ** 2) + ((this.owner.y - this.owner.c_y) ** 2))

        let distance = rel_distance > this.distance ? this.distance : rel_distance
                
        this.owner.level.sounds.push({
            name:'cast',
            x: this.owner.x,
            y: this.owner.y
        })

        let hit_x = this.owner.x + (Math.sin(this.owner.attack_angle) * distance)
        let hit_y = this.owner.y + (Math.cos(this.owner.attack_angle) * distance)

       
   
        let t = this.owner.getTarget()

        if(!t){
            let box = this.owner.getBoxElipse()
            box.x = hit_x
            box.y = hit_y
            box.r = 4


           t = this.owner.level.enemies.filter(elem => Func.elipseCollision(box, elem.getBoxElipse()))[0]
        }

        if(!t){
            this.owner.target = undefined
            return
        }
       
        if(Func.notChance(20 * this.count)){
            this.count ++
            this.owner.cast_speed -= 150

             let e = new Soul(this.owner.level)
             e.setPoint(t.x, t.y)

             this.owner.level.effects.push(e)
        }
        else{
            this.owner.cast_speed += this.count * 150
            this.count = 0

            t.takeDamage(this.owner, {
                instant_death: true,
                explode: true
            })

            if(t.is_dead){
                let count = 5
                
                let zones = 6.28 / count
        
                for(let i = 1; i <= count; i++){
                    let min_a = (i - 1) * zones
                    let max_a = i * zones
        
                    let angle = Math.random() * (max_a - min_a) + min_a
                    let proj = new SoulShatterProj(this.owner.level)
                    proj.setStart(this.owner.level.time)
                    proj.setAngle(angle)
                    proj.setPoint(t.x, t.y)
        
                    this.owner.level.projectiles.push(proj)
                }
            }
        }

        this.owner.target = undefined
        this.afterUse()
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

        this.owner.using_ability = this
        
        this.owner.is_attacking = true
        this.owner.state = 'cast'
        this.owner.addMoveSpeedPenalty(-70)

        this.owner.stateAct = this.act
       
        this.owner.action_time = this.owner.getCastSpeed()
        this.owner.setImpactTime(85)

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.addMoveSpeedPenalty(70)
            this.owner.hit = false
            this.owner.is_attacking = false
            this.owner.hit_x = undefined
            this.owner.hit_y = undefined
        }
    }

    async act(){
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