import IUnitState from "../Interfaces/IUnitState";
import Character from "../Objects/src/Character";
import PlayerIdleState from "./PlayerIdleState";

export default class PlayerDefendState implements IUnitState<Character>{

    move_reduce_value = 0

    enter(player: Character){
        player.state = 'defend'
        player.triggers_on_start_block.forEach(elem => elem.trigger(this))

        this.move_reduce_value = player.getMoveSpeedReduceWhenBlock()
        player.addMoveSpeedPenalty(-this.move_reduce_value)
    }

    update(player: Character){
        if(!player.pressed[32]){
            player.setState(new PlayerIdleState())
        }
    }

    exit(player: Character){
        player.addMoveSpeedPenalty(this.move_reduce_value)
    }
}