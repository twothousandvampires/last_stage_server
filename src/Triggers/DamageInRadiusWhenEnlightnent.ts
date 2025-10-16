import Func from "../Func";
import FlamyRing from "../Objects/Effects/FlamyRing";
import Character from "../Objects/src/Character";

export default class DamageInRadiusWhenEnlightnent {

    cd: number = 2000
    last_trigger_time: number = 0

    trigger(player: Character){
    
        if(player.level.time - this.last_trigger_time >= this.cd){
            
            let e = new FlamyRing(player.level)
            e.setPoint(player.x, player.y)

            player.level.addEffect(e)

            let enemies = player.level.enemies.filter(elem => !elem.is_dead && Func.distance(player, elem) <= 25)

            enemies.forEach(elem => {
                elem.takeDamage(player, {
                    burn: true
                })
            })
        }
    }
}