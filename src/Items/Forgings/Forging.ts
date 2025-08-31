import Character from "../../Objects/src/Character";
import Item from "../Item";

export default abstract class Forging{

    stat: string | undefined
    max_value: number = 0

    constructor(protected item: Item){

    }

    abstract forge(player: Character | undefined): void

    toJSON(){
       return {
           name: this.stat,
           max: this.max_value,
           value: this.getValue()
       }
    }

    getValue(){
        return this.item[this.stat]
    }
}