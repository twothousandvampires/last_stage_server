import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class Will extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 20
        this.name = 'will'
        this.stat = 'increases your will'
        this.gold_cost = 3
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.value += 1
            this.item.player.will += 1
             this.payCost()
        }
    }

    getValue(){
        return this.value
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.item.player.will < this.max_value
    }
}