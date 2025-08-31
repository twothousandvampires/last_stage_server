import Character from "../Objects/src/Character";
import Immortality from "../Status/Immortality";
import Recharge from "./Forgings/Recharge";
import Item from "./Item";

    export default class RedPotion extends Item{
        used: boolean

        constructor(){
            super()
            this.used = false
            this.name = 'red potion'
            this.type = 3
            this.forge = [
                new Recharge(this)
            ]
        }

        equip(character: Character): void {
            character.reach_near_dead_triggers.push(this)
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