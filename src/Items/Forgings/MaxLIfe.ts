import Item from "../Item";
import Forging from "./Forging";

export default class MaxLIfe extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 10
        this.name = 'life essence'
        this.description = 'increases a chance to ignore maximum life when regen'
        this.gold_cost = 16
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.value += 1
            this.item.player.can_regen_more_life_chance ++
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