import Func from "../Func";
import { ThrowedWeaponShard } from "../Objects/Projectiles/ThrowedWeaponShard";
import Character from "../Objects/src/Character";
import Item from "./Item";

export default class FlyingShards extends Item {
      
    last_trigger_time: number = 0
    
    constructor(){
        super()
        this.type = 3
        this.chance = 30
        this.count = 2
        this.frequency = 1000
        this.description = 'When you block hit with armour there is a chance to realise metal shards to enemies'
    }

    equip(character: Character): void {
        character.triggers_on_armour_hit.push(this)
    }

    getSpecialForgings(): string[] {
        return ['chance', 'count', 'frequency']
    }

    trigger(character: Character, target: any){
        if(this.disabled) return

        if(character.level.time - this.last_trigger_time >= this.frequency && Func.chance(this.chance)){
            this.last_trigger_time = character.level.time
            let count =  this.count
            
            let zones = 6.28 / count
    
            for(let i = 1; i <= count; i++){
                let min_a = (i - 1) * zones
                let max_a = i * zones
    
                let angle = Math.random() * (max_a - min_a) + min_a
                let proj = new ThrowedWeaponShard(character.level)
                proj.setAngle(angle)
                proj.setPoint(character.x, character.y)
                proj.setOwner(character)
    
                character.level.projectiles.push(proj)
            }
        }
    }
}