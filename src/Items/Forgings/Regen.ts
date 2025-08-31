import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class Regen extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 4000
        this.stat = 'regeneration'
    }

    forge(player: Character){
        if(player.base_regen_time > this.max_value){
            this.value += 200
            player.base_regen_time -= 200
        }
    }

    getValue(){
        return this.value
    }
}