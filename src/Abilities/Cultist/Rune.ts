import Cultist from "../../Objects/src/PlayerClasses/Cultist";
import CultistAbility from "./CultistAbility";
import RuneEffect from "../../Objects/Effects/Rune";
import Func from "../../Func";

export default class Rune extends CultistAbility{

    distance: number
    runefield: boolean
    fast_detonation: boolean
    explosive: boolean
    second_detanation: boolean

    constructor(owner: Cultist){
        super(owner)
        this.name = 'rune'
        this.distance = 25
        this.runefield = false
        this.fast_detonation = false
        this.explosive = false
        this.second_detanation = false
        this.cd = 0
    }

    canUse(): boolean {
        return !this.used && this.owner.can_cast && !this.owner.is_attacking
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

        // this.owner.setTimerToGetState(this.owner.getCastSpeed())
    }

    async act(){
        if(this.action && !this.hit){
            this.hit = true
        
            let rel_distance = Math.sqrt(((this.x - this.c_x) ** 2) + ((this.y - this.c_y) ** 2))

            let distance = rel_distance > this.first_ability.distance ? this.first_ability.distance : rel_distance
            
             this.level.sounds.push({
                    name:'cast',
                    x: this.x,
                    y: this.y
            })

            let hit_x = this.x + (Math.sin(this.attack_angle) * distance)
            let hit_y = this.y + (Math.cos(this.attack_angle) * distance)

            let rune = new RuneEffect(this.level)
            rune.fast_detonation = this.first_ability.fast_detonation
            rune.explosive = this.first_ability.explosive
            rune.second_detanation = this.first_ability.second_detanation

            rune.setOwner(this)
            rune.setPoint(hit_x, hit_y)

            this.level.binded_effects.push(rune)
            
            if(this.first_ability.runefield){
                
                let count = this.getSecondResource()
                
                let zones = 6.28 / count
        
                for(let i = 1; i <= count; i++){
                    await Func.sleep(300)
                    let distance_x = Func.random(5, 9)
                    let distance_y = Func.random(5, 9)

                    let min_a = (i - 1) * zones
                    let max_a = i * zones

                    let angle = Math.random() * (max_a - min_a) + min_a

                    let x = hit_x + (Math.sin(angle) * distance_x)
                    let y = hit_y + (Math.cos(angle) * distance_y)

                    let rune = new RuneEffect(this.level)
                    rune.fast_detonation = this.first_ability.fast_detonation
                    rune.explosive = this.first_ability.explosive
                    rune.second_detanation = this.first_ability.second_detanation

                    rune.setOwner(this)
                    rune.setPoint(x, y)

                    this.level.binded_effects.push(rune)
                }

                if(count){
                    this.first_ability.used = true
                    this.first_ability.cd = 1500 * count
                    setTimeout(() => {
                        this.first_ability.cd = 0
                        this.first_ability.used = false

                    }, this.first_ability.getCd())
                }
            }

            this.attack_angle = undefined
        }
        else if(this.action_is_end){
            this.action_is_end = false
            this.getState()
        }
    }
}