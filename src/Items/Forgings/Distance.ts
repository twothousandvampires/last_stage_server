import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class Distance extends Forging {

    constructor(item: Item){
        super(item)
        this.max_value = 100
        this.stat = 'distance'
    }

    forge(){
        if(this.canBeForged()){
            this.item.distance += 2
        }
    }

    canBeForged(): boolean {
        return this.item.distance != undefined && this.item.distance < this.max_value
    }
}