import Character from "../Objects/src/Character";
import SparklingHelmetStatus from "../Status/SparklingHelmetStatus";
import Status from "../Status/Status";
import TwilightGlovesStatus from "../Status/TwilightGlovesStatus";
import Item from "./Item";

export default class TwilightGloves extends Item{

    unit: any
    frequency: number = 5000

    constructor(){
        super()
        this.name = 'twilight gloves'
        this.type = 2
        this.description = 'periodically create clots of energy on enemies'
        this.count = 1
        this.distance = 15
        this.chance = 40
        
    }

    getSpecialForgings(): string[] {
            return ['count', 'frequency', 'distance', 'chance']
    }
    
    equip(character: Character): void {
        let status = new TwilightGlovesStatus(character.level.time, this)
    
        character.level.setStatus(character, status)
    }
}