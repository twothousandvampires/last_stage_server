import Item from "../Item";
import Forging from "./Forging";

export default class GoldFind extends Forging {

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 25
        this.name = 'gold find'
        this.description = 'increase a chance to get additional gold'
        this.gold_cost = 10
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.value += 3
            this.item.player.chance_to_get_additional_gold += 3
            this.payCost()
        }
    }

    getValue(){
        return this.value
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.value < this.max_value
    }
}