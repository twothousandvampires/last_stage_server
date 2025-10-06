import IUnitState from "../Interfaces/IUnitState";
import { Enemy } from "../Objects/src/Enemy/Enemy";

export default class EnemySpawnState implements IUnitState<Enemy>{

    start = 0

    enter(enemy: Enemy){
        enemy.state = 'spawn'
        enemy.action_time = enemy.spawn_time

        this.start = enemy.level.time
    }   

    update(enemy: Enemy){
        if(enemy.level.time - this.start >= enemy.spawn_time){
            enemy.is_spawning = false
            enemy.getState()
        }
    }

    exit(enemy: Enemy){
        
    }
}