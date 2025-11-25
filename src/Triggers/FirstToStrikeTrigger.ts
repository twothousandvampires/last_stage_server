import Func from "../Func";
import Character from "../Objects/src/Character";
import AttackAndCastSpeed from "../Status/AttackAndCastSpeed";
import Power from "../Status/Power";

export default class FirstToStrikeTrigger {

    cd: number = 1000
    last_trigger_time: number = 0
    chance: number= 30

    trigger(player: Character){
        if(player.level.time - this.last_trigger_time >= this.cd){
            this.last_trigger_time = player.level.time
            if(Func.notChance(this.chance, player.is_lucky)) return
            
            let s = new AttackAndCastSpeed(player.level.time)
            s.setPower(60)
            s.setDuration(8000)

            player.level.setStatus(player, s, true)
        }
    }
}