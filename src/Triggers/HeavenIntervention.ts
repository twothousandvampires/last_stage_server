import Func from "../Func";
import HeavenRay from "../Objects/Effects/HeavenRay";
import Character from "../Objects/src/Character";

export default class HeavenIntervention {

    cd: number = 3000
    last_trigger_time: number = 0
    chance: number = 10

    constructor(){
        
    }

    trigger(player: Character){
        if(player.level.time - this.last_trigger_time < this.cd) return
        if(Func.notChance(this.chance)) return
     
        this.last_trigger_time = player.level.time

        let targets = player.level.enemies.filter(elem => !elem.is_dead && Func.distance(elem, player) <= 20)

        let random = targets[Math.floor(Math.random() * targets.length)]

        if(!random) return

        let e = new HeavenRay(player.level)
        e.setPoint(random.x, random.y)

        random.takeDamage(player, {})

        player.level.effects.push(e)
    }
}