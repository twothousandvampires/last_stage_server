import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class Knowledge extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 20
        this.stat = 'knowledge'
    }

    forge(player: Character){
        if(player.knowledge < this.max_value){
            this.value += 1
            player.knowledge += 1
        }
    }

    getValue(){
        return this.value
    }
}