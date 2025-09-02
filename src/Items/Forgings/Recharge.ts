import Item from "../Item";
import Forging from "./Forging";

export default class Recharge extends Forging {

    constructor(item: Item){
        super(item)
        this.max_value = 90
        this.name = 'recharge item'
        this.stat = 'recharge'
        this.gold_cost = 2
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.item.used = false
            this.payCost()
        }
    }

    getValue(){
        return 'this.value'
    }

    canBeForged(): boolean {
        return this.item.used != undefined && this.item.used === true
    }
}