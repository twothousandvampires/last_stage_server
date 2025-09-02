import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class Resist extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 100
        this.name = 'resist'
        this.stat = 'increases your status resist'
        this.gold_cost = 3
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.value += 2
            this.item.player.status_resistance += 2
             this.payCost()
        }
    }

    getValue(){
        return this.value
    }

     canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.item.player.status_resistance < this.max_value
    }
}