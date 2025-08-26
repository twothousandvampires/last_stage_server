import Character from "../Objects/src/Character";
import SparklingHelmetStatus from "../Status/SparklingHelmetStatus";
import Status from "../Status/Status";
import Item from "./Item";

export default class SparklingHelmet extends Item{

    unit: any
    power: number
    status: Status | undefined

    constructor(){
        super()
        this.power = 1
    }
    
    equip(character: Character): void {
        let status = new SparklingHelmetStatus(character.level.time)
        this.status = status
        status.setPower(this.power)
        
        character.level.setStatus(character, status)
    }

    canBeForged(character: Character): boolean {
        return this.power < 4
    }
                
    forge(character: Character): void {
        this.power ++
        this.status?.setPower(this.power)  
    }
}