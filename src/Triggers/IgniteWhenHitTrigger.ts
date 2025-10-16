
import Func from "../Func";
import Character from "../Objects/src/Character";
import Unit from "../Objects/src/Unit";
import Ignite from "../Status/Ignite";

export default class IgniteWhenHitTrigger {

    cd: number = 1200
    last_trigger_time: number = 0
    chance: number = 0

    constructor(){
        
    }

    trigger(player: Character, target: Unit){
        if(Func.notChance(this.chance, player.is_lucky)) return

        if(player.level.time - this.last_trigger_time >= this.cd){
            this.last_trigger_time = player.level.time
            let box = target.getBoxElipse()
            box.r = 12

            let targets = player.level.enemies.concat(player.level.players.filter(elem => elem != player)).filter(elem => !elem.is_dead && Func.elipseCollision(elem.getBoxElipse() ,box))
            
            for(let i = 0; i < targets.length; i++){
                let target = targets[i]
                
                let s = new Ignite(player.level.time)
                s.setDuration(6000)
                s.setPower(30)
                s.provider = player

                player.level.setStatus(target, s, true)
            }
        }
    }
}
