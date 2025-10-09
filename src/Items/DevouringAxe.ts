import Func from "../Func";
import Character from "../Objects/src/Character";
import Devouring from "../Status/Devouring";
import Item from "./Item";

export default class DevouringAxe extends Item {

    constructor(){
        super()
        this.chance = 100
        this.name = 'devouring axe'
        this.type = 1
        this.description = 'give you a chance to get devouring after kill'
    }

    getSpecialForgings(): string[] {
        return ['chance']
    }

    equip(character: Character): void {
        character.triggers_on_kill.push(this)
    }
    
    trigger(character: Character, target = undefined){
        if(this.disabled) return
        if(!target) return

        if(Func.chance(this.chance)){
            let exist = character.level.status_pull.find(elem => elem instanceof Devouring && elem.unit === character)
            
            if(exist){
                return
            }

            let s = new Devouring(character.level.time)
            s.setDuration(5000)
        
            character.level.setStatus(character, s)
        }
    }
}