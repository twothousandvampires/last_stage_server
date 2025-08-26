import Character from "../Objects/src/Character";
import Fragility from "../Status/Fragility";
import Precision from "../Status/Precision";
import Item from "./Item";

export default class GlassSword extends Item{
    
    chance: number
    distance: number
    power: number

    constructor(){
        super()
        this.chance = 25
        this.distance = 15
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
        let f_status = new Fragility(0)
        let p_status = new Precision(0)

        f_status.setPower(100)
        p_status.setPower(100)

        character.level.setStatus(character, f_status)
        character.level.setStatus(character, p_status)
    }
}