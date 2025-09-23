import Character from "../Objects/src/Character";
import Item from "./Item";

export default class IceBelt extends Item{
    
    constructor(){
        super()
        this.name = 'ice belt'
        this.type = 2
        this.description = 'increases maximum of resources'
    }

    equip(character: Character): void {
        character.max_resource ++
    }

    disable(): void {
        this.disabled = true
        if(this.player){
            this.player.max_resource --
        }
    }

    enable(): void {
        this.disabled = false
        if(this.player){
            this.player.max_resource ++
        }
    }
}