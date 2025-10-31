import Ability from "../Abilities/Ability"
import Func from "../Func"
import Character from "../Objects/src/Character"
import FlyingSwordsStatus from "../Status/FlyingSwordsStatus"
import Mastery from "./Mastery"

export default class FlyingSwords extends Mastery {

    base_chance: number = 3
    
    constructor(){
        super()
        this.name = 'flying swords'
        this.description = 'When the ability is activated, there is a chance to summon flying swords.'
    }

    trigger(player: Character, ability: Ability){
        if(Func.chance(this.base_chance + ability.cost * 7)){
            let s = new FlyingSwordsStatus(player.level.time)
            s.setDuration(10000)

            player.level.setStatus(player, s, true)
        }
    }
}