import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class ArmourRate extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 90
        this.stat = 'armour rate'
    }

    forge(player: Character){
        if(player.armour_rate < this.max_value){
            this.value ++
            player.armour_rate += 1
        }
    }

    getValue(){
        return this.value
    }
}