import Func from "../Func";
import HeavenRay from "../Objects/Effects/HeavenRay";
import Character from "../Objects/src/Character";

export default class DivineWeaponTrigger {

    cd: number = 3000
    last_trigger_time: number = 0

    trigger(player: Character, target: any = undefined){
        if(Func.notChance(Math.round(player.will * 1.5), player.is_lucky)) return
            
        if(player.level.time - this.last_trigger_time >= this.cd){
            this.last_trigger_time = player.level.time
            if(!target) return

            let targets = player.level.enemies.filter(elem => !elem.is_dead && Func.distance(elem, target) <= 20).slice(0, 3)

            targets.forEach(elem => {
                elem.takeDamage(player)
                let e = new HeavenRay(player.level)
                e.setPoint(elem.x, elem.y)

                player.level.effects.push(e)
            })
        }
    }
}