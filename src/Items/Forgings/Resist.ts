import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class Resist extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 100
        this.stat = 'resist'
    }

    forge(player: Character){
        if(player.status_resistance < this.max_value){
            this.value += 2
            player.status_resistance += 2
        }
    }

    getValue(){
        return this.value
    }
}