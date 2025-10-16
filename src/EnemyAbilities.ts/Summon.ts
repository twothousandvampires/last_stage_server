import Func from "../Func"
import Bones from "../Objects/src/Enemy/Bones"
import Enemy from "../Objects/src/Enemy/Enemy"
import Impy from "../Objects/src/Enemy/Impy"
import EnemyAbility from "./EnemyAbility"

export default class Summon extends EnemyAbility {

    cooldown: number = 18000

    canUse(enemy: Enemy){
        return enemy.level.time - this.last_used_time >= this.cooldown && enemy.target
    }

    use(enemy: Enemy){
        this.last_used_time = enemy.level.time
        if(!enemy.target) return

        enemy.level.sounds.push({
            name:'cast',
            x: enemy.x,
            y: enemy.y
        })

        let summoned = Math.random() > 0.5 ? new Impy(enemy.level) : new Bones(enemy.level)

        while(summoned.isOutOfMap()){
            let angle = Math.random() * 6.28
            let distance_x = Func.random(5, 10)
            let distance_y = Func.random(5, 10)

            summoned.setPoint(enemy.x + Math.sin(angle) * distance_x, enemy.y + Math.cos(angle) * distance_y)
        }
        
        enemy.level.enemies.push(summoned)
    }
}