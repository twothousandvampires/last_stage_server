import Func from "../Func";
import Character from "../Objects/src/Character";
import Item from "./Item";

export default class YellowStone extends Item{
    constructor(){
        super()
        this.count = 1
        this.name = 'yellow stone'
        this.type = 3
        this.description = 'increases a chance to resist status, when you resist gain a ward'
        this.chance = 20
    }

    getSpecialForgings(): string[] {
        return ['chance']
    }

    equip(character: Character): void {
        character.on_status_resist_triggers.push(this)
    }

    trigger(character: Character){
        if(this.disabled) return
        if(Func.notChance(this.chance, character.is_lucky))
        
        character.addWard(1)
    }
}