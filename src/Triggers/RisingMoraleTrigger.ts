import Func from "../Func";
import Character from "../Objects/src/Character";

export default class RisingMoraleTrigger {

    chance: number = 20
    name: string = 'raising morale'
    description: string = 'Gives a chance to heal yourself and your allies'

    constructor(){

    }

    trigger(player: Character){
        if(Func.notChance(this.chance)) return

        let box = player.getBoxElipse()
        box.r = player.voice_radius

        player.level.players.forEach(elem => {
            if(Func.elipseCollision(box, elem.getBoxElipse())){
                elem.addLife()
            }
        })
    }
}