import Character from "../Objects/src/Character";
import SparklingHelmetStatus from "../Status/SparklingHelmetStatus";
import Status from "../Status/Status";
import Item from "./Item";

export default class SparklingHelmet extends Item{

    unit: any
    status: Status | undefined

    constructor(){
        super()
        this.name = 'sparkling helmet'
        this.type = 2
    }
    
    equip(character: Character): void {
        let status = new SparklingHelmetStatus(character.level.time)
        this.status = status
        status.setPower(1)
        
        character.level.setStatus(character, status)
    }
}