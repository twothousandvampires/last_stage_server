import Item from "../Item";
import Forging from "./Forging";

export default class Frequency extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 300
        this.name = 'frequency'
        this.stat = 'increases item frequency of procing'
        this.gold_cost = 5
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.value ++
            this.item.frequency -= 200
             this.payCost()
        }
    }

    getValue(){
        return this.value
    }

    canBeForged(): boolean {
        if(!this.item) return false

        return this.item.frequency > this.max_value
    }
}