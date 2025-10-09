import Character from "../../Objects/src/Character";
import LightningWhenUseAbilityTrigger from "../../Triggers/LightningWhenUseAbilityTrigger";
import SparksWhenBlockTrigger from "../../Triggers/SparksWhenBlockTrigger";
import Item from "../Item";
import Forging from "./Forging";

export default class SparksWhenBlock extends Forging {

    value: number = 0
   
    constructor(item: Item){
        super(item)
        this.max_value = 20
        this.name = 'charged shield'
        this.description = 'chance to release sparks when block'
        this.gold_cost = 12
    }

    forge(player: Character){
        if(this.canBeForged() && this.costEnough()){
            let trigger = player.triggers_on_block.find(elem => elem instanceof SparksWhenBlockTrigger)

            if(trigger){
                trigger.chance += 5
            }
            else{
                let t = new SparksWhenBlockTrigger()
                t.chance = 5

                player.triggers_on_block.push(t)
            }
           
            this.payCost()
            this.value += 5
        }
    }

    getValue(){
        return this.value
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.value < this.max_value
    }
}