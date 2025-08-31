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
        if(this.item.distance && this.item.distance < this.max_value){
            this.item.distance += 2
        }
    }
}