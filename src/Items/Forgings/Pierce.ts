import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class Pierce extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 100
        this.stat = 'pierce'
    }

    forge(player: Character){
        if(player.pierce < this.max_value){
            this.value ++
            player.pierce += 1
        }
    }

    getValue(){
        return this.value
    }
}