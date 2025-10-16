import Func from "../../Func";
import QuakeEffect from "../../Objects/Effects/Quake";
import Character from "../../Objects/src/Character";
import Unit from "../../Objects/src/Unit";
import Ignite from "../../Status/Ignite";
import Item from "../Item";
import Forging from "./Forging";

export default class StunWhenHit extends Forging{

    value: number = 0
    freq: number = 3000
    last_trigger_time: number = 0


    constructor(item: Item){
        super(item)
        this.max_value = 80
        this.name = 'stun when hit'
        this.description = 'gives chance to stun in radius when you hit enemy'
        this.gold_cost = 20
    }

    forge(player: Character){
        if(this.canBeForged() && this.costEnough()){
            if(!player.triggers_on_hit.some(elem => elem instanceof StunWhenHit)){
                player.triggers_on_hit.push(this)
            }

            this.payCost()
            this.value += 10
        }
    }

    getValue(){
        return this.value
    }

    trigger(player: Character, target: Unit){
        if(Func.notChance(this.value, player.is_lucky)) return
        if(!target) return

        let effect = new QuakeEffect(player.level)
        effect.setPoint(target.x, target.y)

        player.level.effects.push(effect)

        if(player.level.time - this.last_trigger_time >= this.freq){
            this.last_trigger_time = player.level.time
            let box = target.getBoxElipse()
            box.r = 8

            let targets = player.level.enemies.concat(player.level.players.filter(elem => elem != player)).filter(elem => !elem.is_dead && Func.elipseCollision(elem.getBoxElipse() ,box))
            
            for(let i = 0; i < targets.length; i++){
                let target = targets[i]
                
                target.setStun(3000)
            }
        }
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.value < this.max_value
    }
}