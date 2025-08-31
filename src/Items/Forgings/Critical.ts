import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class Critical extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 100
        this.stat = 'critical'
    }

    forge(player: Character){
        if(player.critical < this.max_value){
            this.value ++
            player.critical += 1
        }
    }

    getValue(){
        return this.value
    }
}