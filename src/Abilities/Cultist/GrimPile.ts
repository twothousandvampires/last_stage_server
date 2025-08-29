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
        this.cd = 6000
    }

    canUse(): boolean {
        return this.owner.resource >= this.cost && this.owner.can_cast && !this.used && !this.owner.is_attacking
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
        this.owner.state = 'cast'
        this.owner.addMoveSpeedPenalty(-70)

        this.owner.stateAct = this.act
        let cast_speed = this.owner.getCastSpeed()

        this.owner.action_time = cast_speed

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
                
            let rel_distance = Math.sqrt(((this.x - this.c_x) ** 2) + ((this.y - this.c_y) ** 2))

            this.level.sounds.push({
                    name:'dark cast',
                    x: this.x,
                    y: this.y
            })

            let distance = rel_distance > this.first_ability.distance ? this.first_ability.distance : rel_distance
            
            let hit_x = this.x + (Math.sin(this.attack_angle) * distance)
            let hit_y = this.y + (Math.cos(this.attack_angle) * distance)

            let totem_power = this.getSecondResource()

            let pile = new GrimPileTotem(this.level, totem_power)
            pile.increased_effect = this.second_ability.increased_effect
            pile.resistance = this.second_ability.resistance
            
            pile.setPoint(hit_x, hit_y)
          
            this.level.enemies.push(pile)
            this.attack_angle = undefined
            this.afterUseSecond()
        }
        else if(this.action_is_end){
            this.action_is_end = false
            this.getState()
        }
    }
}