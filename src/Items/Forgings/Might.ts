import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class Might extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 20
        this.name = 'might'
        this.description = 'increases your might'
        this.gold_cost = 5
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.value += 1
            this.item.player.might += 1
            this.payCost()
        }
    }

    getValue(){
        return this.value
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.item.player.might < this.max_value
    }
}