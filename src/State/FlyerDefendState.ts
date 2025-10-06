import IUnitState from "../Interfaces/IUnitState";
import Flyer from "../Objects/src/PlayerClasses/Flyer";
import PlayerIdleState from "./PlayerIdleState";

export default class FlyerDefendState implements IUnitState<Flyer>{

    move_reduce_value = 0

    enter(player: Flyer){
        player.state = 'defend'
        player.triggers_on_start_block.forEach(elem => elem.trigger(this))

        player.can_regen_resource = player.allow_mana_regen_while_def
        
        player.phasing = player.takeoff
    }

    update(player: Flyer){
        if(!player.pressed[32]){
            player.setState(new PlayerIdleState())
        }
    }

    exit(player: Flyer){
        player.can_regen_resource = true
        player.phasing = false
    }
}