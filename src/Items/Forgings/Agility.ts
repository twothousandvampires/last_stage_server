import Item from "../Item";
import Forging from "./Forging";

export default class Agility extends Forging {

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 20
        this.name = 'agility'
        this.stat = 'increases your agility'
        this.gold_cost = 5
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.value += 1
            this.item.player.agility += 1
            this.payCost()
        }
    }

    getValue(){
        return this.value
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.item.player.agility < this.max_value
    }
}