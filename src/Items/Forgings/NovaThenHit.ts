import FrostNova from "../../Objects/Effects/FrostNova";
import Character from "../../Objects/src/Character";
import Unit from "../../Objects/src/Unit";
import Item from "../Item";
import Forging from "./Forging";

export default class NovaThenHit extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 80
        this.stat = 'chance to cast frost nova when hit'
    }

    forge(player: Character){
        if(!player.on_hit_triggers.some(elem => elem instanceof NovaThenHit)){
            player.on_hit_triggers.push(this)
        }
        
        this.value += 15
    }

    getValue(){
        return this.value
    }

    trigger(player: Character, target: Unit){
        let e = new FrostNova(player.level)
        e.setPoint(target.x, target.y)
        
        player.level.effects.push(e)
    }
}