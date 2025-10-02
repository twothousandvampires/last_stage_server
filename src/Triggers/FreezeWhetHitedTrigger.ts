
import Func from "../Func";
import FrostExplosionSmall from "../Objects/Effects/FrostExplosionSmall";
import Character from "../Objects/src/Character";
import Unit from "../Objects/src/Unit";

export default class FreezeWhetHitedTrigger {

    cd: number = 1200
    last_trigger_time: number = 0
    chance: number = 0

    constructor(){
        
    }

    trigger(player: Character, target: Unit){
        if(Func.notChance(this.chance, player.is_lucky)) return

        if(player.level.time - this.last_trigger_time >= this.cd){

            this.last_trigger_time = player.level.time
            let box = player.getBoxElipse()

            if(target){
                box = target.getBoxElipse()
            }
           
            box.r = 10

            let targets = player.level.enemies.concat(player.level.players.filter(elem => elem != player)).filter(elem => !elem.is_dead && Func.elipseCollision(elem.getBoxElipse() ,box))
            
            for(let i = 0; i < targets.length; i++){
                let target = targets[i]
                
                target.setFreeze(2500)

                let e = new FrostExplosionSmall(player.level)
                e.setPoint(target.x, target.y)

                player.level.effects.push(e)
            }
        }
    }
}
