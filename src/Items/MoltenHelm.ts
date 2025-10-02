import Func from "../Func";
import Character from "../Objects/src/Character";
import Exhaustion from "../Status/Exhaustion";
import Ignite from "../Status/Ignite";
import Item from "./Item";

export default class MoltenHelm extends Item{
    
    frequency: number = 3000
    last_trigger_time: number = 0

    constructor(){
        super()
        this.name = 'molten helm'
        this.type = 2
        this.description = 'when you start blocking you ignite enemies within a radius and youself, the power of the burn depends on your armor. it has a 15-second cooldown'
    }

    equip(character: Character): void {
        character.triggers_on_start_block.push(this)
    }

    trigger(character: Character){
        if(this.disabled) return

        let time = character.level.time

        if(time - this.last_trigger_time >= this.frequency){
            this.last_trigger_time = time

            let s = new Ignite(time)
            s.setDuration(4000)
            s.setPower(character.armour_rate)
            character.level.setStatus(character, s, true)

            character.level.addSound('fire cast', character.x, character.y)
          
            let box = character.getBoxElipse()
            box.r = 12
            character.level.enemies.forEach(elem => {
                if(!elem.is_dead && Func.elipseCollision(box, elem.getBoxElipse())){
                    let s = new Ignite(time)

                    s.setDuration(6000)
                    s.setPower(character.armour_rate)
                    character.level.setStatus(elem, s)
                }
            })
        }
    }
}