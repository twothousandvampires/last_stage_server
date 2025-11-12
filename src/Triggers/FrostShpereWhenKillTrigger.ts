import Func from "../Func";
import { FrostSphereProjectile } from "../Objects/Projectiles/FrostSphereProjectile";
import Character from "../Objects/src/Character";
import Unit from "../Objects/src/Unit";

export default class FrostShpereWhenKillTrigger {

    cd: number = 1200
    last_trigger_time: number = 0
    chance: number = 0

    constructor(){
        
    }

    trigger(player: Character, target: Unit){
        if(!target) return
        if(Func.notChance(this.chance, player.is_lucky)) return
          
        if(player.level.time - this.last_trigger_time >= this.cd){
            if(target.exploded || target.burned) return
            
            this.last_trigger_time = player.level.time
            target.freezed = true

            let count = 3
            let zones = 6.28 / count

            for(let i = 1; i <= count; i++){
                let min_a = (i - 1) * zones
                let max_a = i * zones
    
                let angle = Math.random() * (max_a - min_a) + min_a
                let proj = new FrostSphereProjectile(player.level)
                proj.setOwner(player)
                proj.setAngle(angle)
                proj.setPoint(target.x, target.y)
    
                player.level.projectiles.push(proj)
            }
        }
    }
}