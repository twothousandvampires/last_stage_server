import Character from "../Objects/src/Character";
import Fortify from "../Status/Fortify";
import InnerPower from "../Status/InnerPower";

export default class InnerPowerTrigger {

    cd: number = 2000
    last_trigger_time: number = 0
    while_alive: boolean = false

    trigger(player: Character){
        if(player.level.time - this.last_trigger_time < this.cd) return
     
        this.last_trigger_time = player.level.time

        let s = new InnerPower(player.level.time)
        s.setDuration(5000)

        player.level.setStatus(player, s, true)

        if(this.while_alive){
            let s = new Fortify(player.level.time)
            s.setDuration(5000)
            s.setPower(40)

            player.level.setStatus(player, s)
        }
    }
}