import IUnitState from "../Interfaces/IUnitState";
import Enemy from "../Objects/src/Enemy/Enemy";

export default class EnemyDeadState implements IUnitState<Enemy>{

    enter(enemy: Enemy){
        enemy.is_corpse = true
        enemy.state = 'dead'
    }   

    update(enemy: Enemy){
       
    }

    exit(player: Enemy){

    }
}