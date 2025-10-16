
import Func from "../Func";
import { Lightning } from "../Objects/Projectiles/Lightning";
import Character from "../Objects/src/Character";
import Unit from "../Objects/src/Unit";

export default class LightningWhenUseAbilityTrigger {

    cd: number = 1200
    last_trigger_time: number = 0
    chance: number = 0

    constructor(){
        
    }

    trigger(player: Character, target: Unit){
        if(Func.notChance(this.chance, player.is_lucky)) return

        if(player.level.time - this.last_trigger_time >= this.cd){
            this.last_trigger_time = player.level.time
            
            let count = 3
            let zones = 6.28 / count

            for(let i = 1; i <= count; i++){
                let min_a = (i - 1) * zones
                let max_a = i * zones
    
                let angle = Math.random() * (max_a - min_a) + min_a
                let proj = new Lightning(player.level)
                proj.setOwner(player)
                proj.setAngle(angle)
                proj.setPoint(player.x, player.y)
    
                player.level.projectiles.push(proj)
            }
        }
    }
}