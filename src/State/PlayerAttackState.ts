import IUnitState from "../Interfaces/IUnitState";
import Character from "../Objects/src/Character";
import PlayerIdleState from "./PlayerIdleState";

export default class PlayerAttackState implements IUnitState<Character>{

    move_penalty = 0

    enter(player: Character){
        player.prepareToAction()
        player.state = 'attack'

        this.move_penalty = player.getMoveSpeedPenaltyValue()      
        player.addMoveSpeedPenalty(-this.move_penalty)

        player.action_time = player.getAttackSpeed()
        player.setImpactTime(80)

    }

    update(player: Character){
        if(player.action && !player.hit){
            player.hit = true
            player.using_ability.impact()
            if(player.using_ability){
                player.using_ability.afterUse()
            }
            if(player.using_ability?.need_to_pay){
                player.payCost()
            }
            player.succefullCast()
        }
        else if(player.action_is_end){
            player.action_is_end = false
            player.attack_angle = undefined
            player.using_ability = undefined
            player.setState(new PlayerIdleState())
        }
    }       

    exit(player: Character){
        player.using_ability = undefined
        player.hit = false
        player.is_attacking = false
        player.action = false
        player.target = undefined
        player.addMoveSpeedPenalty(this.move_penalty)    
    }
}