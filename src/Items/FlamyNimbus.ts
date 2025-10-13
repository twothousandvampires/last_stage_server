import Func from "../Func";
import LightNova from "../Objects/Effects/LightNova";
import Character from "../Objects/src/Character";
import Item from "./Item";

export default class FlamyNimbus extends Item {
      
    last_trigger_time: number = 0
    radius: number = 30

    constructor(){
        super()
        this.type = 3
        this.chance = 20
        this.frequency = 4000
        this.description = 'when you get maximum energy create a ring that burn enemies'
        this.name = 'flamy nimbus'
    }

    equip(character: Character): void {
        character.triggers_on_get_energy.push(this)
    }

    getSpecialForgings(): string[] {
        return ['chance']
    }

    trigger(character: Character, target: any){
        if(this.disabled) return
        if(character.resource < character.maximum_resources) return

        if(character.level.time - this.last_trigger_time >= this.frequency && Func.chance(this.chance)){
            this.last_trigger_time = character.level.time
            
            let e = new LightNova(character.level)
            e.setPoint(character.x, character.y)

            character.level.addEffect(e)

            let enemies = character.level.enemies.filter(elem => !elem.is_dead && Func.distance(character, elem) <= this.radius)

            enemies.forEach(elem => {
                elem.takeDamage(character, {
                    burn: true
                })
            })
        }
    }
}