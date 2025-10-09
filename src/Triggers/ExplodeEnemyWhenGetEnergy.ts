import Func from "../Func";
import FireExplosion from "../Objects/Effects/FireExplosion";
import Character from "../Objects/src/Character";
import Unit from "../Objects/src/Unit";

export default class ExplodeEnemyWhenGetEnergy {

    cd: number = 1200
    last_trigger_time: number = 0
    chance: number = 0

    constructor(){
        
    }

    trigger(player: Character, target: Unit){

        if(Func.notChance(this.chance, player.is_lucky)) return
          
        if(player.level.time - this.last_trigger_time >= this.cd){
            this.last_trigger_time = player.level.time
          
            let targets = player.level.enemies.filter(elem => elem.is_corpse && Func.distance(elem, player) <= 20)

            let target = Func.getRandomFromArray(targets)

            if(!target) return

            player.level.addSound('corpse explode', target.x, target.y)

            let e = new FireExplosion(player.level)
            e.setPoint(target.x, target.y)

            player.level.effects.push(e)

            let box = target.getBoxElipse()
            box.r = 12

            player.level.enemies.forEach(elem => {
                if(!elem.is_dead && Func.elipseCollision(elem.getBoxElipse(), box)){
                    elem.takeDamage(undefined, {})
                }
            })

            player.level.deleted.push(target.id)
            player.level.removeEnemy(target)
        }
    }
}