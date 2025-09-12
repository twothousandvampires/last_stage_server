import Func from "../Func";
import Gold from "../Objects/Effects/Gold";
import Character from "../Objects/src/Character";
import Unit from "../Objects/src/Unit";
import Item from "./Item";

export default class RingOfTransmutation extends Item{

    constructor(){
        super()
        this.chance = 5
        this.name = 'ring of transmutation'
        this.type = 3
        this.description = 'when hitted by enemy there is a chance turn them into gold'
    }

    getSpecialForgings(): string[] {
        return ['chance']
    }

    equip(character: Character): void {
        character.when_hited_triggers.push(this)
    }
    
    trigger(character: Character, unit: Unit | undefined){
        console.log(unit)
        if(this.disabled) return
        if(!unit) return
        
        if(Func.chance(this.chance)){

            if(!unit.is_dead){
                unit.takeDamage(character, {
                    instant_death: true
                })
            }
            
            character.gold += 10

            character.level.addSound('gold spending', unit.x, unit.y)
            let e = new Gold(character.level)
            e.setPoint(unit.x, unit.y)
            character.level.effects.push(e)
            
        }
    }
}