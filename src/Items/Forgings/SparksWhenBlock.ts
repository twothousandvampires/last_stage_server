import Character from "../../Objects/src/Character";
import LightningWhenUseAbilityTrigger from "../../Triggers/LightningWhenUseAbilityTrigger";
import SparksWhenBlockTrigger from "../../Triggers/SparksWhenBlockTrigger";
import Item from "../Item";
import Forging from "./Forging";

export default class SparksWhenBlock extends Forging {

    value: number = 0
    trigger: any
   
    constructor(item: Item){
        super(item)
        this.max_value = 20
        this.name = 'charged shield'
        this.description = 'gives a chance to release sparks when block'
        this.gold_cost = 12
    }

    forge(player: Character){
        if(this.canBeForged() && this.costEnough()){
            if(!this.trigger){
                this.trigger = new SparksWhenBlockTrigger()
                player.triggers_on_block.push(this.trigger)
            }
            this.trigger.chance += 5
            
            this.payCost()
            this.value += 5
        }
    }

    getValue(){
        return this.value + '%'
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.value < this.max_value
    }
}