import Func from "../Func";
import Character from "../Objects/src/Character";
import CommandsStatus from "../Status/CommandsStatus";

export default class EmergencyOrdersTrigger {

    chance: number = 20

    constructor(){

    }

    trigger(player: Character){
        if(!Func.chance(this.chance)) return

        let box = player.getBoxElipse()
        box.r = player.voice_radius

        player.level.players.forEach(elem => {
            if(Func.elipseCollision(box, elem.getBoxElipse())){
                let status = new CommandsStatus(player.level.time)
                status.setDuration(3000)

                player.level.setStatus(elem, status, true)
            }
        })
    }
}