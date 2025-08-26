import Character from "../Objects/src/Character";
import Item from "./Item";

export default class YellowStone extends Item{
    power: number

    constructor(){
        super()
        this.power = 1
    }

    canBeForged(character: Character): boolean {
        return this.power < 4
    }
    
    forge(character: Character): void {
        this.power ++
    }
    
    equip(character: Character): void {
        character.on_status_resist_triggers.push(this)
        character.status_resistance += 10
    }

    trigger(character: Character){
        character.ward += this.power
    }
}