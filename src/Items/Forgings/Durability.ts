import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class Durability extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 20
        this.stat = 'durability'
    }

    forge(player: Character){
        if(this.canBeForged()){
            this.value += 1
            this.item.player.durability += 1
        }
    }

    getValue(){
        return this.value
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.item.player.durability < this.max_value
    }
}