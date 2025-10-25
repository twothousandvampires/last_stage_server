import Func from "../Func";
import Character from "../Objects/src/Character";

export default class MagicFlowTrigger {

    chance: number = 40

    constructor(){

    }

    trigger(player: Character){
        if(Func.notChance(this.chance)) return

        let box = player.getBoxElipse()
        box.r = player.voice_radius

        player.level.players.forEach(elem => {
            if(Func.elipseCollision(box, elem.getBoxElipse())){
                elem.addResourse(1 ,true)
            }
        })
    }
}