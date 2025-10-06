import Func from "../Func";
import Character from "../Objects/src/Character";
import Devouring from "../Status/Devouring";
import Item from "./Item";

export default class DevouringAxe extends Item {

    status: any

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
    
    trigger(character: Character){
        if(this.disabled) return
        
        if(this.status != undefined){
            return
        }
        else if(Func.chance(this.chance)){
            let s = new Devouring(character.level.time)
            s.setDuration(5000)
            s.provider = this
            this.status = s

            character.level.setStatus(character, this.status, true)
        }
    }
}