import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class Regen extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 4000
        this.name = 'regeneration'
        this.stat = 'increase yours life regeneration speed'
        this.gold_cost = 4
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.value += 200
            this.item.player.base_regen_time -= 200
             this.payCost()
        }
    }

    getValue(){
        return this.value
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.item.player.base_regen_time > this.max_value
    }
}