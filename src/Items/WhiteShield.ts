import Func from "../Func";
import Character from "../Objects/src/Character";
import Item from "./Item";

export default class WhiteShield extends Item{
    power: number

    constructor(){
        super()
        this.power = 1
    }

    canBeForged(character: Character): boolean {
        return this.power < 4
    }
    
    forge(character: Character): void {
        this.power ++
    }
    
    equip(character: Character): void {
        character.when_block_triggers.push(this)
    }

    trigger(character: Character){
        if(Func.chance(this.power * 10)){
            character.ward ++
        }
    }
}