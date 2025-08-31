import Item from "../Item";
import Forging from "./Forging";

export default class Duration extends Forging {

    constructor(item: Item){
        super(item)
        this.stat = 'duration'
    }

    forge(){
        if(this.canBeForged()){
            this.item.duration += 500
        }
    }

    canBeForged(): boolean {
        return this.item.duration != undefined
    }
}