import Item from "../Item";
import Forging from "./Forging";

export default class Duration extends Forging {

    constructor(item: Item){
        super(item)
        this.name = 'duration'
        this.stat = 'increases duration of item effects'
        this.gold_cost = 5
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.item.duration += 500
             this.payCost()
        }
    }

    canBeForged(): boolean {
        return this.item.duration != undefined
    }
}