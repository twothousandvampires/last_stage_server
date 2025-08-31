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

    forge(){
        if(this.canBeForged()){
            this.value ++
            this.item.player.pierce += 1
        }
    }

    getValue(){
        return this.value
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.item.player.pierce < this.max_value
    }
}