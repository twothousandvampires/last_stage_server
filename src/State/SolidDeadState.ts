import Func from "../Func";
import IUnitState from "../Interfaces/IUnitState";
import Enemy from "../Objects/src/Enemy/Enemy";

export default class SolidDeadState implements IUnitState<Enemy>{

    enter(enemy: Enemy){
        enemy.state = 'dead'
    
        enemy.action_time = 1200
        enemy.setImpactTime(100)  
    }   

    update(enemy: Enemy){
       if(!enemy.explode && enemy.action){
            enemy.explode = true
            enemy.action = false
            enemy.state = 'dead_explode'
            
            enemy.level.enemies.forEach(elem => {
                if(elem != enemy && Func.distance(enemy, elem) <= 12){
                    elem.takeDamage(undefined, {
                        burn: true
                    })
                }
            })

            enemy.level.players.forEach( elem => {
                if(Func.distance(enemy, elem) <= 12){
                    elem.takeDamage()
                }
            })

            enemy.wasChanged()
            enemy.is_corpse = true
        }
}

    exit(player: Enemy){

    }
}