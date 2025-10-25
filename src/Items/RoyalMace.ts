import Character from "../Objects/src/Character";
import Item from "./Item";

export default class RoyalMace extends Item{
    
    constructor(){
        super()
        this.name = 'royal mace'
        this.type = 1
        this.description = 'increases impact, crush and critical rating'
    }

    equip(character: Character): void {
        character.impact += 5
        character.crushing_rating += 5
        character.critical += 5
    }

    disable(): void {
        this.disabled = true
        if(this.player){
            this.player.impact -= 5
            this.player.crushing_rating -= 5
            this.player.critical -= 5
        }
    }

    enable(): void {
        this.disabled = false
        if(this.player){
            this.player.impact += 5
            this.player.crushing_rating += 5
            this.player.critical += 5
        }
    }
}