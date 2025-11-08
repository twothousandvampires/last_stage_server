import Ability from "../Abilities/Ability"
import Func from "../Func"
import Heal from "../Objects/Effects/Heal"
import Character from "../Objects/src/Character"
import Mastery from "./Mastery"

export default class Recovery extends Mastery {

    base_chance: number = 5
    
    constructor(){
        super()
        this.name = 'recovery'
        this.description = 'When you start ability there is a chance to get life.'
    }

    trigger(player: Character, ability: Ability){
        
        if(Func.chance(this.base_chance + ability.cost * 5)){
            let e = new Heal(player.level)
            e.setPoint(player.x, player.y)
            player.level.addEffect(e)

            player.addLife()
        } 
    }
}