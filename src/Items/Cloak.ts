import Func from "../Func";
import Character from "../Objects/src/Character";
import Phase from "../Status/Phase";
import Item from "./Item";

export default class Cloak extends Item{
    
    constructor(){
        super()
        this.chance = 40
        this.name = 'cloak'
        this.type = 2
        this.description = 'gives a chance to gain phasing when taking damage'
    }

    equip(character: Character): void {
        character.when_hited_triggers.push(this)
    }
    
    getSpecialForgings(): string[] {
        return ['chance', 'duration']
    }

    trigger(character: Character){
        if(this.disabled) return
        
        if(Func.chance(this.chance)){
            let status = new Phase(character.time)

            status.setDuration(3000 + this.duration)
            character.level.setStatus(character, status, true)
        }
    }
}