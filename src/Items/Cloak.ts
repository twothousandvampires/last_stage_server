import Func from "../Func";
import Character from "../Objects/src/Character";
import Phase from "../Status/Phase";
import Chance from "./Forgings/Chance";
import Duration from "./Forgings/Duration";
import Item from "./Item";

export default class Cloak extends Item{
    
    constructor(){
        super()
        this.chance = 40
        this.name = 'cloak'
        this.type = 2
        this.forge = [
            new Chance(this),
            new Duration(this)
        ]
    }

    equip(character: Character): void {
        character.when_hited_triggers.push(this)
    }
    
    trigger(character: Character){
        if(Func.chance(this.chance)){
            let status = new Phase(character.time)

            status.setDuration(3000 + this.duration)
            character.level.setStatus(character, status, true)
        }
    }
}