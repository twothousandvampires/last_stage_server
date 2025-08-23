import Func from "../Func";
import { SmokeDaggerShard } from "../Objects/Projectiles/SmokeDaggerShard";
import Character from "../Objects/src/Character";
import Item from "./Item";

export default class DaggerOfSmoke extends Item{
    
    chance: number
    power: number

    constructor(){
        super()
        this.chance = 40
        this.power = 0
    }

    canBeForged(character: Character): boolean {
        return this.power < 3
    }
    
    forge(character: Character): void {
        this.power ++
        this.chance += 5
    }

    equip(character: Character): void {
        character.onHealTriggers.push(this)
    }
    
    trigger(character: Character){
        if(Func.chance(this.chance)){
            let box = character.getBoxElipse()
            box.r = 9

            let count = character.level.enemies.filter(elem => Func.elipseCollision(box, elem.getBoxElipse())).length
            
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