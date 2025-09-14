import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class Pierce extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 100
        this.name = 'pierce'
        this.description = 'provides you a chance to ignore enemy armour'
        this.gold_cost = 6
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.value ++
            this.item.player.pierce += 1
             this.payCost()
        }
    }

    getValue(){
        return this.value
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.item.player.pierce < this.max_value
    }
}