import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class MaxResource extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 15
        this.stat = 'maximum resourses'
    }

    forge(player: Character){
        if(player.max_resource < this.max_value){
            this.value ++
            player.max_resource += 1
        }
    }

    getValue(){
        return this.value
    }
}