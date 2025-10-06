import Func from "../Func";
import IUnitState from "../Interfaces/IUnitState";
import Enemy from "../Objects/src/Enemy/Enemy";
import EnemyAttackState from "./EnemyAttackState";
import EnemyCastState from "./EnemyCastState";
import EnemyMoveAct from "./EnemyMoveState";

export default class EnemyMeleeIdleState implements IUnitState<Enemy>{

    enter(enemy: Enemy){
        enemy.state = 'idle'
    }

    update(enemy: Enemy){
        enemy.checkPlayer()
               
        if(!enemy.target){
            return
        } 

        let a_e = enemy.getBoxElipse()
        a_e.r = enemy.attack_radius
        
        if(enemy.isAbilityToUse()){
            enemy.setState(new EnemyCastState())
        }
        else if(Func.elipseCollision(a_e, enemy.target.getBoxElipse())){
            if (enemy.enemyCanAtack()){
                enemy.setState(new EnemyAttackState())
            }

            else{
                enemy.getState()
            }
        }
        else{
            enemy.setState(new EnemyMoveAct())
        }
    }

    exit(player: Enemy){

    }
}