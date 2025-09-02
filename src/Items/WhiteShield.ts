import Func from "../Func";
import Character from "../Objects/src/Character";
import Chance from "./Forgings/Chance";
import Item from "./Item";

export default class WhiteShield extends Item{

    constructor(){
        super()
        this.chance = 40
        this.name = 'white shield'
        this.type = 2
        this.forge = [
            new Chance(this),
        ]
    }

    equip(character: Character): void {
        character.when_block_triggers.push(this)
    }

    trigger(character: Character){
        if(Func.chance(this.chance)){
            character.ward ++
        }
    }
}