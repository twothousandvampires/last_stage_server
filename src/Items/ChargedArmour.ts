import Func from "../Func";
import Character from "../Objects/src/Character";
import Ignite from "../Status/Ignite";
import Item from "./Item";

export default class ChargedArmour extends Item{
    
    constructor(){
        super()
        this.name = 'charged armour'
        this.type = 2
        this.description = 'when you get energy there is a chance that if it is not max - you get a ward, otherwise you lose the whole ward and get set on fire'
        this.chance = 15
    }

    equip(character: Character): void {
        character.when_gain_energy_triggers.push(this)
    }

    getSpecialForgings(): string[] {
        return ['chance']
    }

    trigger(character: Character){
        if(this.disabled) return
        if(Func.notChance(this.chance)) return

        if(character.resource < character.max_resource){
            character.addWard(1)
        }
        else{
            character.loseWard(111111)

            let s = new Ignite(character.level.time)
            s.setDuration(5000)
            s.setPower(40)

            character.level.setStatus(character, s, true)
        }
    }
}