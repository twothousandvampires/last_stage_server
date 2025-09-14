import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class Knowledge extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 20
        this.name = 'knowledge'
        this.description = 'increases your knowledge'
        this.gold_cost = 5
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.value += 1
            this.item.player.knowledge += 1
             this.payCost()
        }
    }

    getValue(){
        return this.value
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.item.player.knowledge < this.max_value
    }
}