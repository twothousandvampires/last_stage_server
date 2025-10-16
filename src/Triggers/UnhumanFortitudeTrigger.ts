import Func from "../Func";
import Character from "../Objects/src/Character";
import CommandsStatus from "../Status/CommandsStatus";
import Fortify from "../Status/Fortify";

export default class UnhumanFortitudeTrigger {

    cd: number = 2000
    last_trigger_time: number = 0
    chance: number = 30

    constructor(){
        
    }
    
        trigger(player: Character, target: any = undefined){
            if(Func.notChance(this.chance, player.is_lucky)) return 

            if(player.level.time - this.last_trigger_time >= this.cd){
                this.last_trigger_time = player.level.time

                let s = new Fortify(player.level.time)
                s.setPower(player.durability)
                s.setDuration(5000)

                player.level.setStatus(player, s, true)
            }
        }
}