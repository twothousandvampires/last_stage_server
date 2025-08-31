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

    forge(){
        if(this.canBeForged()){
            this.value += 2
            this.item.player.status_resistance += 2
        }
    }

    getValue(){
        return this.value
    }

     canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.item.player.status_resistance < this.max_value
    }
}