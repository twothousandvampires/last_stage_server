import Character from "../Objects/src/Character";
import Item from "./Item";

export default class YellowStone extends Item{
    constructor(){
        super()
        this.count = 1
        this.name = 'yellow stone'
        this.type = 3
        this.description = 'increases a chance to resist status, when you resist gain a ward'
    }

    getSpecialForgings(): string[] {
        return ['count']
    }

    equip(character: Character): void {
        character.on_status_resist_triggers.push(this)
        character.status_resistance += 5
    }

    trigger(character: Character){
        if(this.disabled) return
        
        character.addWard(1)
    }
}