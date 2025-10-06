import IUnitState from "../Interfaces/IUnitState";
import { Enemy } from "../Objects/src/Enemy/Enemy";

export default class EnemyDyingState implements IUnitState<Enemy>{

    start = 0

    enter(enemy: Enemy){
        let to_delete = true
        enemy.invisible = false
        
        if(enemy.freezed){
            enemy.state = 'freeze_dying'
            enemy.level.sounds.push({
                name: 'shatter',
                x: enemy.x,
                y: enemy.y
            })
        }
        else if(enemy.burned){
            enemy.state = 'burn_dying'
        }
        else if(enemy.exploded){
            enemy.state = 'explode'
        }
        else{
            enemy.state = 'dying'
            to_delete = false
        }

        if(to_delete){
            enemy.level.removeEnemy(enemy)
        }
        else{
            //todo
            this.start = enemy.level.time
            enemy.afterDead()
        }
    }   

    update(enemy: Enemy){
       if(enemy.level.time - this.start >= enemy.dying_time){
            enemy.getState()
        }
    }

    exit(player: Enemy){

    }
}