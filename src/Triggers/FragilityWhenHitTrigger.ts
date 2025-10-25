
import Func from "../Func";
import Character from "../Objects/src/Character";
import Unit from "../Objects/src/Unit";
import Fragility from "../Status/Fragility";

export default class FragilityWhenHitTrigger {

    cd: number = 2000
    last_trigger_time: number = 0

    constructor(public chance: number = 100){
        
    }

    trigger(player: Character, target: Unit){
        if(Func.notChance(this.chance, player.is_lucky)) return
        if(!target) return

        if(player.level.time - this.last_trigger_time >= this.cd){
            this.last_trigger_time = player.level.time
            
            let s = new Fragility(player.level.time)
            s.setDuration(4000)

            player.level.setStatus(target, s)
        }
    }
}