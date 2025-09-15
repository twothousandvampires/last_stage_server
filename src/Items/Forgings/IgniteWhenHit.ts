import Func from "../../Func";
import Character from "../../Objects/src/Character";
import Unit from "../../Objects/src/Unit";
import Ignite from "../../Status/Ignite";
import Item from "../Item";
import Forging from "./Forging";

export default class IgniteWhenHit extends Forging{

    value: number = 0
    freq: number = 2000
    last_trigger_time: number = 0


    constructor(item: Item){
        super(item)
        this.max_value = 80
        this.name = 'ignite on hit'
        this.description = 'chance to ignite in radius of hitting'
        this.gold_cost = 20
    }

    forge(player: Character){
        if(this.canBeForged() && this.costEnough()){
            if(!player.on_hit_triggers.some(elem => elem instanceof IgniteWhenHit)){
                player.on_hit_triggers.push(this)
            }

            this.payCost()
            this.value += 20
        }
    }

    getValue(){
        return this.value
    }

    trigger(player: Character, target: Unit){
        if(Func.notChance(this.value, player.is_lucky)) return

        if(player.level.time - this.last_trigger_time >= this.freq){
            this.last_trigger_time = player.level.time
            let box = target.getBoxElipse()
            box.r = 14

            let targets = player.level.enemies.concat(player.level.players.filter(elem => elem != player)).filter(elem => !elem.is_dead && Func.elipseCollision(elem.getBoxElipse() ,box))
            

            for(let i = 0; i < targets.length; i++){
                let target = targets[i]
                
                let s = new Ignite(player.level.time)
                s.setDuration(6000)
                s.setPower(40)

                player.level.setStatus(target, s, true)
            }
        }
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.value < this.max_value
    }
}