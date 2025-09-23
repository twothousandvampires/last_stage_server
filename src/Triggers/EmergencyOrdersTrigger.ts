import Func from "../Func";
import Character from "../Objects/src/Character";
import CommandsStatus from "../Status/CommandsStatus";

export default class EmergencyOrdersTrigger {

    chance: number = 35

    constructor(){

    }

    trigger(player: Character){
        if(Func.notChance(this.chance)) return

        let box = player.getBoxElipse()
        box.r = player.voice_radius

        player.level.players.forEach(elem => {
            if(Func.elipseCollision(box, elem.getBoxElipse())){
                let status = new CommandsStatus(player.level.time, 20, 10)
                status.setDuration(3000)

                player.level.setStatus(elem, status, true)
            }
        })
    }
}