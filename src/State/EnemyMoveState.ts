import Func from "../Func";
import IUnitState from "../Interfaces/IUnitState";
import { Enemy } from "../Objects/src/Enemy/Enemy";
import EnemyAttackState from "./EnemyAttackState";

export default class EnemyMoveState implements IUnitState<Enemy>{

    enter(enemy: Enemy){
        enemy.state = 'move'
    }   

    update(enemy: Enemy){
        enemy.checkPlayer()
               
        if(!enemy.target){
            return
        } 

        let a_e = enemy.getBoxElipse()
        a_e.r = enemy.attack_radius

        if(Func.elipseCollision(a_e, enemy.target.getBoxElipse())){
            if (enemy.enemyCanAtack()){
                console.log('her')
                enemy.setState(new EnemyAttackState())
            }
        }
        else{
            let a = Func.angle(enemy.x, enemy.y, enemy.target.x, enemy.target.y)

            enemy.moveByAngle(a)
            enemy.wasChanged()
        }
    }

    exit(player: Enemy){

    }
}