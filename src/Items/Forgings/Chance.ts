import Item from "../Item";
import Forging from "./Forging";

export default class Chance extends Forging {

    constructor(item: Item){
        super(item)
        this.max_value = 90
        this.name = 'chance'
        this.description = 'increases chance to item proc'
        this.gold_cost = 5
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.item.chance += 2
            this.payCost()
        }
    }

    canBeForged(): boolean {
        return this.item.chance != undefined && (this.item.chance < this.max_value)
    }
}