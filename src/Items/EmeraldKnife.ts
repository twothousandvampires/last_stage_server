import Character from "../Objects/src/Character";
import Item from "./Item";

export default class EmeraldKnife extends Item{
    constructor(){
        super()
        this.name = 'emerald knife'
        this.type = 1
        this.description = 'increase a chance to get additional gold'
    }
    
    equip(character: Character): void {
        character.gold_find += 25
    }

    disable(): void {
        this.disabled = true
        if(this.player){
             this.player.gold_find -= 25
        }
    }

    enable(): void {
        this.disabled = false
        if(this.player){
             this.player.gold_find += 25
        }
    }
}