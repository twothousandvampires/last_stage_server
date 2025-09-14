import Item from "../Item";
import Forging from "./Forging";

export default class Toughness extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 100
        this.name = 'toughness'
        this.description = 'increases your chance to avoid damaged state'
        this.gold_cost = 4
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.value += 2
            this.item.player.avoid_damaged_state_chance += 2
            this.payCost()
        }
    }

    getValue(){
        return this.value
    }

     canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.item.player.avoid_damaged_state_chance < this.max_value
    }
}