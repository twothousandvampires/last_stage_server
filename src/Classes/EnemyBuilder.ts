import Level from "../Level";
import Skull from "../Objects/src/Enemy/Skull";

export default class EnemyBuilder{
    static createEnemy(enemy_name: string, level: Level){
        if(enemy_name === 'skull'){
            return new Skull(level)
        }
    }
}