import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class Charisma extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 3
        this.name = 'charisma'
        this.description = 'you are more speachfull'
        this.gold_cost = 8
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.value ++
            this.item.player.chance_to_say_phrase += 1
            this.payCost()
        }
    }

    getValue(){
        return this.value
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.value < this.max_value
    }
}