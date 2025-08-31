import Item from "../Item";
import Forging from "./Forging";

export default class Recharge extends Forging {

    constructor(item: Item){
        super(item)
        this.max_value = 90
        this.stat = 'recharge'
    }

    forge(){
        if(this.canBeForged()){
            this.item.used = false
        }
    }

    canBeForged(): boolean {
        return this.item.used != undefined && this.item.used === true
    }
}