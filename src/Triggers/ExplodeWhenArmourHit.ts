
import Func from "../Func";
import FireExplosion from "../Objects/Effects/FireExplosion";
import Character from "../Objects/src/Character";

export default class ExplodeWhenArmourHit {

    cd: number = 1500
    last_trigger_time: number = 0
    chance: number = 0

    trigger(player: Character){
        if(Func.notChance(this.chance, player.is_lucky)) return

        if(player.level.time - this.last_trigger_time >= this.cd){
            this.last_trigger_time = player.level.time

            let e = new FireExplosion(player.level)
            e.setPoint(player.x, player.y)

            player.level.addEffect(e)

            player.level.enemies.forEach(elem => {
                if(!elem.is_dead && Func.distance(player, elem) <= 14){
                    elem.takeDamage(player, {
                        burn: true
                    })
                }
            })
        }
    }
}