import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class Might extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 20
        this.stat = 'might'
    }

    forge(player: Character){
        if(player.might < this.max_value){
            this.value += 1
            player.might += 1
        }
    }

    getValue(){
        return this.value
    }
}