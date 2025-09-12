import Character from "../Objects/src/Character";
import Item from "./Item";

export default class Staff extends Item{

    constructor(){
        super()
        this.name = 'staff'
        this.type = 1
        this.description = 'reduces cooldowns'
    }

    equip(character: Character): void {
        character.cd_reduction += 12
    }

    disable(): void {
        this.disabled = true
        if(this.player){
             this.player.cd_reduction -= 12
        }
    }

    enable(): void {
        this.disabled = false
        if(this.player){
             this.player.cd_reduction += 12
        }
    }
}