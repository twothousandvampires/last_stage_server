import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class Agility extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 20
        this.stat = 'agility'
    }

    forge(player: Character){
        if(player.agility < this.max_value){
            this.value += 1
            player.agility += 1
        }
    }

    getValue(){
        return this.value
    }
}