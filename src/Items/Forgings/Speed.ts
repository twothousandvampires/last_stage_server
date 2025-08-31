import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class Speed extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 20
        this.stat = 'speed'
    }

    forge(player: Character){
        if(player.speed < this.max_value){
            this.value += 1
            player.speed += 1
        }
    }

    getValue(){
        return this.value
    }
}