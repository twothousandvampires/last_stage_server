import Func from "../../Func";
import Cultist from "../../Objects/src/PlayerClasses/Cultist";
import CultistAbility from "./CultistAbility";
import PileOfThorns from "../../Objects/src/Piles/PileOfThorns";

export default class PileOfThornCast extends CultistAbility{

    distance: 25
    ring_of_pain: boolean
    collection_of_bones: boolean

    constructor(owner: Cultist){
        super(owner)
        this.name = 'pile of thorns'
        this.distance = 25
        this.ring_of_pain = false
        this.collection_of_bones = false
        this.cost = 5
    }

    canUse(): boolean {
        return this.owner.getSecondResource() >= this.cost && this.owner.can_cast
    }

    afterUse(){
        this.owner.useNotUtilityTriggers.forEach(elem => {
                elem.trigger(this.owner)
        })
        this.owner.last_skill_used_time = this.owner.time
    }

    use(){
        if(this.owner.is_attacking) return
       
        let rel_x = Math.round(this.owner.pressed.canvas_x + this.owner.x - 40)
        let rel_y = Math.round(this.owner.pressed.canvas_y + this.owner.y - 40)

        this.owner.pay_to_cost = this.cost

        this.owner.c_x = rel_x
        this.owner.c_y = rel_y  

        if(rel_x < this.owner.x){
            this.owner.flipped = true
        }
        else{
            this.owner.flipped = false    
        } 
      
        this.owner.attack_angle = Func.angle(this.owner.x, this.owner.y, rel_x, rel_y)

        this.owner.is_attacking = true
        this.owner.state = 'cast'
        this.owner.addMoveSpeedPenalty(-70)

        this.owner.stateAct = this.act
        let cast_speed = this.owner.getCastSpeed()

        this.owner.action_time = cast_speed

        this.owner.cancelAct = () => {
            this.owner.action = false
            this.owner.addMoveSpeedPenalty(70)

            setTimeout(()=>{
                this.owner.hit = false
                this.owner.is_attacking = false
                this.owner.hit_x = undefined
                this.owner.hit_y = undefined
            },50)
        }

        this.owner.setTimerToGetState(cast_speed)
    }

    act(){
        if(this.action && !this.hit){
            this.hit = true

             this.level.sounds.push({
                    name:'dark cast',
                    x: this.x,
                    y: this.y
            })

            this.payCost()
            
            let rel_distance = Math.sqrt(((this.x - this.c_x) ** 2) + ((this.y - this.c_y) ** 2))

            let distance = rel_distance > this.first_ab.distance ? this.first_ab.distance : rel_distance
            
            let hit_x = this.x + (Math.sin(this.attack_angle) * distance)
            let hit_y = this.y + (Math.cos(this.attack_angle) * distance)

            let totem_power = this.getSecondResource()
            let pile = new PileOfThorns(this.level, totem_power)
            pile.collection_of_bones = this.third_ab.collection_of_bones
            
            if(this.third_ab.ring_of_pain){
                pile.frequency = 2500
            }
            
            pile.setPoint(hit_x, hit_y)
          
            this.level.enemies.push(pile)
        }
    }
}