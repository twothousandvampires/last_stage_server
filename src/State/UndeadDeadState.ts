import Func from "../Func";
import IUnitState from "../Interfaces/IUnitState";

import Enemy from "../Objects/src/Enemy/Enemy";
import Undead from "../Objects/src/Enemy/Undead";

import UndeadRessurectState from "./UndeadRessurectState";

export default class UndeadDeadState implements IUnitState<Undead>{

    start = 0

    enter(enemy: Undead){
        if(Func.notChance(enemy.ressurect_chance)){
            enemy.is_corpse = true
            enemy.state = 'dead'
        
            enemy.whenDead()
        }
        else{
            enemy.state = 'dead_with_skull'
            enemy.ressurect_chance -= 10
            this.start = enemy.level.time
        }
    }   

    update(enemy: Enemy){
       if(this.start && enemy.level.time - this.start >= 3000){
          enemy.setState(new UndeadRessurectState())
       }
    }

    exit(enemy: Enemy){
        
    }
}