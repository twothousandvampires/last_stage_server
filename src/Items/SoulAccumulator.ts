import Character from "../Objects/src/Character";
import Item from "./Item";

    export default class SoulAccumulator extends Item{
        value: number
        power: number

        constructor(){
            super()
            this.value = 5
            this.power = 0
        }

        canBeForged(character: Character): boolean {
            return this.power < 3
        }
            
        forge(character: Character): void {
            this.power ++
            this.value += 1        
        }

        equip(character: Character): void {
             character.playerDeadTriggers.push(this)
        }
        
        trigger(character: Character){
            if(!character.life_status) return

            character.might += this.value
            character.agility += this.value
            character.knowledge += this.value
            character.speed += this.value
            character.will += this.value
            character.durability += this.value
        }
    }