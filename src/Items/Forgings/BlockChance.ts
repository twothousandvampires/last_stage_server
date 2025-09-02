import Item from "../Item";
import Forging from "./Forging";

export default class BlockChance extends Forging {

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 90
        this.name = 'block chance'
        this.stat = 'increase a chance to block'
        this.gold_cost = 5
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.value += 2
            this.item.player.block_chance += 2
            this.payCost()
        }
    }

    getValue(){
        return this.value
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.item.player.block_chance < this.max_value
    }
}