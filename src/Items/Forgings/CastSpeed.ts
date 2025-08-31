import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class CastSpeed extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 200
        this.stat = 'cast speed'
    }

    forge(player: Character){
        if(player.cast_speed > this.max_value){
            this.value += 20
            player.cast_speed -= 20
        }
    }

    getValue(){
        return this.value
    }
}