import Func from "../Func";
import BoneArmourExplosion from "../Objects/Effects/BoneArmourExplosion";
import Character from "../Objects/src/Character";
import Item from "./Item";

export default class Crossbow extends Item {
    
    last_trigger_time: number = 0

    constructor(){
        super()
        this.name = 'crossbow'
        this.type = 1
        this.chance = 35
        this.frequency = 2000
        this.distance = 10
        this.description = 'when you lead critical damage there is a chance to penetrate nearby enemies'
    }

    equip(character: Character): void {
        character.triggers_on_critical.push(this)
    }

    getSpecialForgings(): string[]{
        return ['chance','frequency']
    }

    trigger(character: Character, target: any){
        if(this.disabled) return
        if(!target) return

        if(character.level.time - this.last_trigger_time >= this.frequency && Func.chance(this.chance)){
            this.last_trigger_time = character.level.time

            let e = new BoneArmourExplosion(character.level)
            e.setPoint(target.x, target.y)
            character.level.effects.push(e)
            
            character.level.enemies.forEach(elem => {
                if(Func.distance(elem, target) <= this.distance){
                    elem.penetrated_rating += 25
                }
            })
        }
    }
}