import Character from "../Objects/src/Character";
import Count from "./Forgings/Count";
import Item from "./Item";

export default class YellowStone extends Item{
    constructor(){
        super()
        this.count = 1
        this.name = 'yellow stone'
        this.type = 3
        this.forge = [
            new Count(this),
        ]
    }

    equip(character: Character): void {
        character.on_status_resist_triggers.push(this)
        character.status_resistance += 10
    }

    trigger(character: Character){
        character.ward += this.count
    }
}