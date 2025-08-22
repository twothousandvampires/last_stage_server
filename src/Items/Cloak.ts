import Func from "../Func";
import Character from "../Objects/src/Character";
import Phase from "../Status/Phase";
import Item from "./Item";

export default class Cloak extends Item{
    
    chance: number
    power: number

    constructor(){
        super()
        this.chance = 40
        this.power = 0
    }

    canBeForged(character: Character): boolean {
        return this.power < 3
    }
    
    forge(character: Character): void {
        this.power ++
        this.chance += 5
    }

    equip(character: Character): void {
        character.whenHitedTriggers.push(this)
    }
    
    trigger(character: Character){
        if(Func.chance(this.chance)){
            let status = new Phase(character.time)
            status.setDuration(3000 + this.power * 300)
            character.level.setStatus(character, status, true)
        }
    }
}