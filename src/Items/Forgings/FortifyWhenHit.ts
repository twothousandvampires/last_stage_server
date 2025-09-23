import Func from "../../Func";
import Character from "../../Objects/src/Character";
import Unit from "../../Objects/src/Unit";
import Dominance from "../../Status/Dominance";
import Fortify from "../../Status/Fortify";
import Item from "../Item";
import Forging from "./Forging";

export default class FortifyWhenHit extends Forging{

    value: number = 0
    freq: number = 3000
    last_trigger_time: number = 0


    constructor(item: Item){
        super(item)
        this.max_value = 30
        this.name = 'fortify'
        this.description = 'when you get hit there is a chance to get fortify(+15 armour rate)'
        this.gold_cost = 12
    }

    forge(player: Character){
        if(this.canBeForged() && this.costEnough()){
            if(!player.on_hit_triggers.some(elem => elem instanceof FortifyWhenHit)){
                player.on_hit_triggers.push(this)
            }

            this.payCost()
            this.value += 5
        }
    }

    getValue(){
        return this.value
    }

    trigger(player: Character, target: Unit){
        if(Func.notChance(this.value, player.is_lucky)) return

        if(player.level.time - this.last_trigger_time >= this.freq){
            this.last_trigger_time = player.level.time
            
            let s = new Fortify(player.level.time)
            s.setDuration(5000)

            player.level.setStatus(player, s, true)
        }
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.value < this.max_value
    }
}