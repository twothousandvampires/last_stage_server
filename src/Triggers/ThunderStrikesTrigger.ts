
import Func from "../Func";
import { Lightning } from "../Objects/Projectiles/Lightning";
import Character from "../Objects/src/Character";

export default class ThunderStrikesTrigger {

    cd: number = 1500
    last_trigger_time: number = 0
    chance: number = 0

    trigger(player: Character, enemy: any){
        if(Func.notChance(this.chance, player.is_lucky)) return
        if(!enemy) return

        let angle = Func.angle(player.x, player.y, enemy.x, enemy.y)

        let l1 = new Lightning(player.level)
        l1.setAngle(angle)
        l1.setPoint(enemy.x + Math.sin(angle) * 4, enemy.y + Math.cos(angle) * 4)

        player.level.projectiles.push(l1)

        let l2 = new Lightning(player.level)
        l2.setAngle(angle - 0.3)
        l2.setPoint(enemy.x + Math.sin(angle) * 4, enemy.y + Math.cos(angle) * 4)

        player.level.projectiles.push(l2)

        let l3 = new Lightning(player.level)
        l3.setAngle(angle + 0.3)
        l3.setPoint(enemy.x + Math.sin(angle) * 4, enemy.y + Math.cos(angle) * 4)

        player.level.projectiles.push(l3)
    }
}