import Character from "../Objects/src/Character";
import Item from "./Item";

export default class Staff extends Item{

    constructor(){
        super()
        this.name = 'staff'
        this.type = 1
        this.description = 'gives a chance for the second skill not to be used after use'
    }

    equip(character: Character): void {
        character.chance_second_skill_not_to_be_used += 12
    }
}