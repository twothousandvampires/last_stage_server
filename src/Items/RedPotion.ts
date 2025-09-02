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
            this.duration = 1500
            this.type = 3
            this.forge = [
                new Recharge(this),
            ]
            this.description = 'when you reach 1 life, your life is restored to full and you gain immortality for a short period'
        }

        equip(character: Character): void {
            character.reach_near_dead_triggers.push(this)
        }

        getSpecialForgings(): string[] {
            return ['duration']
        }

        trigger(character: Character){
            if(this.used) return 
            let status = new Immortality(character.time)
            status.setDuration(this.duration)

            character.level.setStatus(character, status, true)
            
            character.addLife(3)
            this.used = true
        }
    }