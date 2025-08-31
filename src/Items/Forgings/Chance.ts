import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class Chance extends Forging {

    constructor(item: Item){
        super(item)
        this.max_value = 90
        this.stat = 'chance'
    }

    forge(){
        if(this.canBeForged()){
            this.item.chance += 2
        }
    }

    canBeForged(): boolean {
        return this.item.chance != undefined && (this.item.chance < this.max_value)
    }
}