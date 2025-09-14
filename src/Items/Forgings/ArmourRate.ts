import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class ArmourRate extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 90
        this.name = 'armour'
        this.description = 'increases your armour rate'
        this.gold_cost = 5
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.value ++
            this.item.player.armour_rate += 1
            this.payCost()
        }
    }

    getValue(){
        return this.value
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.item.player.armour_rate < this.max_value
    }
}