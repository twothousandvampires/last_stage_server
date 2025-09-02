import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class Speed extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 20
        
        this.stat = 'increases your speed'
        this.gold_cost = 3
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.value += 1
            this.item.player.speed += 1
             this.payCost()
        }
    }

    getValue(){
        return this.value
    }

     canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.item.player.speed < this.max_value
    }
}