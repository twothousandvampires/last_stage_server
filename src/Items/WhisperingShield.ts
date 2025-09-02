import Func from "../Func";
import StrangeLanguage from "../Objects/Effects/StrangeLanguage";
import TextLanguage1 from "../Objects/Effects/TextLanguage1";
import Character from "../Objects/src/Character";
import BlockChance from "./Forgings/BlockChance";
import Chance from "./Forgings/Chance";
import Item from "./Item";

export default class WhisperingShield extends Item {

    constructor(){
        super()
        this.chance = 5
        this.name = 'whispering shield'
        this.type = 2
        this.forge = [
            new Chance(this),
            new BlockChance(this)
        ]
    }

    equip(character: Character): void {
        character.when_block_triggers.push(this)
        character.block_chance += 5
    }
    
    trigger(character: Character){
        if(Func.chance(this.chance)){
             let phrase = new StrangeLanguage(character.level)
             phrase.z = 10
             phrase.setPoint(character.x, character.y)

             character.level.effects.push(phrase)
        }
    }
}