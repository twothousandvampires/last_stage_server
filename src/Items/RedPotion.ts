import Character from "../Objects/src/Character";
import Immortality from "../Status/Immortality";
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
            let status = new Immortality(character.time)
            status.setDuration(1000)
            character.level.setStatus(character, status, true)
            
            character.addLife(3)
            this.used = true
        }
    }