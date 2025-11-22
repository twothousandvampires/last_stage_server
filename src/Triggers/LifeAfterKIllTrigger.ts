import Func from "../Func";
import GoingUpBlood from "../Objects/Effects/GoingUpBlood";
import Character from "../Objects/src/Character";

export default class LifeAfterKIllTrigger {

    cd: number = 1500
    last_trigger_time: number = 0

    trigger(player: Character, enemy: any){
        if(Func.notChance(player.vampiric_rate)) return
        if(!enemy) return
        if(player.level.time - this.last_trigger_time < this.cd) return
     
        this.last_trigger_time = player.level.time

        player.addLife(1)

        let count = 5
                    
        let zones = 6.28 / count

        for(let i = 1; i <= count; i++){
            let min_a = (i - 1) * zones
            let max_a = i * zones

            let angle = Math.random() * (max_a - min_a) + min_a
            let proj = new GoingUpBlood(player.level)
            proj.setPoint(player.x + Math.sin(angle) * Func.random(0,2), player.y - Func.random(2,5))

            player.level.binded_effects.push(proj)
        }
    }
}