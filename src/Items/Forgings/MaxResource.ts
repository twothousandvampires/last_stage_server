import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class MaxResource extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 15
        this.name = 'resourses'
        this.stat = 'increases your value of maximum resourses'
        this.gold_cost = 12
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.value ++
            this.item.player.max_resource += 1
             this.payCost()
        }
    }

    getValue(){
        return this.value
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.item.player.max_resource < this.max_value
    }
}