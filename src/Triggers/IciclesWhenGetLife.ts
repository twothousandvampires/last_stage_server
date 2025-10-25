
import Func from "../Func";
import { Icicle } from "../Objects/Projectiles/Icicle";
import Character from "../Objects/src/Character";

export default class IciclesWhenGetLife {

    cd: number = 1500
    last_trigger_time: number = 0
    chance: number = 0

    trigger(player: Character){
        if(Func.notChance(this.chance, player.is_lucky)) return

        if(player.level.time - this.last_trigger_time >= this.cd){
            this.last_trigger_time = player.level.time

            let count = player.life_status

            let zones = 6.28 / count
            
            for(let i = 1; i <= count; i++){
                let min_a = (i - 1) * zones
                let max_a = i * zones
    
                let angle = Math.random() * (max_a - min_a) + min_a
                let proj = new Icicle(player.level)
                proj.setAngle(angle)
                proj.setPoint(player.x, player.y)
                proj.setOwner(player)
    
                player.level.projectiles.push(proj)
            }
        }
    }
}