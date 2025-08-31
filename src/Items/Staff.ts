import Character from "../Objects/src/Character";
import Item from "./Item";

export default class Staff extends Item{
    
    power: number

    constructor(){
        super()

        this.power = 0
        this.name = 'staff'
        this.type = 1
    }

    canBeForged(character: Character): boolean {
        return this.power < 3
    }
    
    forge(character: Character): void {
        this.power ++
        character.chance_second_skill_not_to_be_used += 3
    }

    equip(character: Character): void {
        character.chance_second_skill_not_to_be_used += 12
    }
}