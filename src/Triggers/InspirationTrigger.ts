import Func from "../Func";
import HeavenRay from "../Objects/Effects/HeavenRay";
import Character from "../Objects/src/Character";

export default class InspirationTrigger {

    cd: number = 2000
    last_trigger_time: number = 0

    constructor(){
        
    }

    trigger(player: Character){
        
        if(Func.notChance(player.perception * 2, player.is_lucky)) return
        
        if(player.level.time - this.last_trigger_time >= this.cd){
            this.last_trigger_time = player.level.time
            
            let e = new HeavenRay(player.level)
            e.setPoint(player.x, player.y)

            player.level.addEffect(e)
            player.resource = player.maximum_resources
        }
    }
}