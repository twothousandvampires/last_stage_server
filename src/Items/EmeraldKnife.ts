import Character from "../Objects/src/Character";
import GoldFind from "./Forgings/GoldFind";
import Item from "./Item";

export default class EmeraldKnife extends Item{
    constructor(){
        super()
        this.name = 'emerald knife'
        this.type = 1
        this.forge = [
            new GoldFind(this)
        ]
    }

    equip(character: Character): void {
        character.gold_find += 25
    }
}