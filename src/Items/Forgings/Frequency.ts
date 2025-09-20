import Item from "../Item";
import Forging from "./Forging";

export default class Frequency extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 500
        this.name = 'frequency'
        this.description = 'increases item frequency of procing'
        this.gold_cost = 5
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.value += 50
            this.item.frequency -= 50
            this.payCost()
        }
    }

    getValue(){
        return this.value
    }

    canBeForged(): boolean {
        if(!this.item) return false

        return this.value < this.max_value
    }
}