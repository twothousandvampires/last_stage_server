import Character from "../Objects/src/Character";
import CrystalGreavesStatus from "../Status/CrystalGreavesStatus";
import Item from "./Item";

export default class CrystalGreaves extends Item{
    
    constructor(){
        super()
        this.chance = 40
        this.name = 'crystal greaves'
        this.type = 2
        this.description = 'You are fragile (15%) when you move, nearby enemies are frigile when you stand'
    }

    equip(character: Character): void {
        let s = new CrystalGreavesStatus(character.level.time)
       
        character.level.setStatus(character, s)
    }
}