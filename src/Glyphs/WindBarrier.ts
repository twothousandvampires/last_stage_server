import Ability from "../Abilities/Ability"
import Func from "../Func"
import SingleTornado from "../Objects/Effects/SingleTornado"
import Character from "../Objects/src/Character"
import Mastery from "./Mastery"

export default class WindBarrier extends Mastery {

    base_chance: number = 5
    
    constructor(){
        super()
        this.name = 'wind barrier'
        this.description = 'When you start ability there is a chance to destroy nearby projectiles.'
    }

    trigger(player: Character, ability: Ability){
        
        if(Func.chance(this.base_chance + ability.cost * 10)){
            let e = new SingleTornado(player.level)
            e.setPoint(player.x, player.y)

            player.level.addEffect(e)
            player.level.projectiles.forEach(elem => {
                if(Func.distance(player, elem) <= 16){
                    elem.impact()
                }
            })
        } 
    }
}