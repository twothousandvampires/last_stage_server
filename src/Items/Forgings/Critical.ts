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

    forge(){
        if(this.canBeForged()){
            this.value ++
            this.item.player.critical += 1
        }
    }

    getValue(){
        return this.value
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.item.player.critical < this.max_value
    }
}