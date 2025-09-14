import Item from "../Item";
import Forging from "./Forging";

export default class Sacredness extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 100
        this.name = 'sacredness'
        this.description = 'increases your chance to get grace after killing enemy'
        this.gold_cost = 10
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.value += 2
            this.item.player.additional_chance_grace_create += 2
             this.payCost()
        }
    }

    getValue(){
        return this.value
    }

     canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.item.player.additional_chance_grace_create < this.max_value
    }
}