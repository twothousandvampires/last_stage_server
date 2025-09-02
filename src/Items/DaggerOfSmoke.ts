import Func from "../Func";
import { SmokeDaggerShard } from "../Objects/Projectiles/SmokeDaggerShard";
import Character from "../Objects/src/Character";
import Item from "./Item";

export default class DaggerOfSmoke extends Item{
    
    constructor(){
        super()
        this.chance = 40
        this.name = 'dagger of smoke'
        this.type = 1
        this.count = 3
        this.description = 'when you heal, there is a chance to create blood shards'
    }

    equip(character: Character): void {
        character.on_heal_triggers.push(this)
    }
    
    getSpecialForgings(): string[] {
        return ['chance', 'count']
    }

    trigger(character: Character){
        if(Func.chance(this.chance)){
            let box = character.getBoxElipse()
            box.r = 9

            let count = this.count
            
            let zones = 6.28 / count
    
            for(let i = 1; i <= count; i++){
                let min_a = (i - 1) * zones
                let max_a = i * zones
    
                let angle = Math.random() * (max_a - min_a) + min_a
                let proj = new SmokeDaggerShard(character.level)
                proj.setAngle(angle)
                proj.setPoint(character.x, character.y)
                proj.setOwner(character)
    
                character.level.projectiles.push(proj)
            }
        }
    }
}