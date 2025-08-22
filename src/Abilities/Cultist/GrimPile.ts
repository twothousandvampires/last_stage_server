import Func from "../../Func";
import Cultist from "../../Objects/src/PlayerClasses/Cultist";
import CultistAbility from "./CultistAbility";
import GrimPileTotem from "../../Objects/src/Piles/GrimPile";

export default class GrimPile extends CultistAbility{

    distance: 25
    increased_effect: boolean
    resistance: boolean

    constructor(owner: Cultist){
        super(owner)
        this.name = 'grim pile'
        this.increased_effect = false
        this.resistance = false
        this.distance = 25
        this.cost = 2
    }

    canUse(): boolean {
        return this.owner.getSecondResource() >= this.cost && this.owner.can_cast
    }


    use(){
        if(this.owner.is_attacking) return
        
        this.owner.pay_to_cost = this.cost

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
                this.used = false
            },50)
        }

        this.owner.setTimerToGetState(cast_speed)
    }

    act(){
        if(this.action && !this.hit){
            this.hit = true
                
            let rel_distance = Math.sqrt(((this.x - this.c_x) ** 2) + ((this.y - this.c_y) ** 2))

            this.level.sounds.push({
                    name:'dark cast',
                    x: this.x,
                    y: this.y
            })

            let distance = rel_distance > this.first_ab.distance ? this.first_ab.distance : rel_distance
            
            let hit_x = this.x + (Math.sin(this.attack_angle) * distance)
            let hit_y = this.y + (Math.cos(this.attack_angle) * distance)

            let totem_power = this.getSecondResource()

            let pile = new GrimPileTotem(this.level, totem_power)
            pile.increased_effect = this.second_ab.increased_effect
            pile.resistance = this.second_ab.resistance
            
            pile.setPoint(hit_x, hit_y)
          
            this.level.enemies.push(pile)

            this.payCost()
            this.attack_angle = undefined
        }
    }
}