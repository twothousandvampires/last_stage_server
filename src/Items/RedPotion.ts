import Character from "../Objects/src/Character";
import Item from "./Item";

    export default class RedPotion extends Item{
        used: boolean

        constructor(){
            super()
            this.used = false
        }

        canBeForged(character: Character): boolean {
            return this.used
        }

        forge(character: Character): void {
            this.used = false
        }

        equip(character: Character): void {
            character.reachNearDeadTriggers.push(this)
        }

        trigger(character: Character){
            if(this.used) return 

            character.addLife(3)
            this.used = true
        }
    }