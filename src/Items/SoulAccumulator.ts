import Character from "../Objects/src/Character";
import Count from "./Forgings/Count";
import Item from "./Item";

    export default class SoulAccumulator extends Item{
  
        constructor(){
            super()
            this.count = 5
            this.name = 'soul accumulator'
            this.type = 3
            this.forge = [
                new Count(this)
            ]
        }

        equip(character: Character): void {
             character.player_dead_triggers.push(this)
        }
        
        trigger(character: Character){
            if(!character.life_status) return

            character.might += this.count
            character.agility += this.count
            character.knowledge += this.count
            character.speed += this.count
            character.will += this.count
            character.durability += this.count
        }
    }