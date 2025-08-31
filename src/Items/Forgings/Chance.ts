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
        if(this.item.chance && this.item.chance < this.max_value){
            this.item.chance += 2
        }
    }
}