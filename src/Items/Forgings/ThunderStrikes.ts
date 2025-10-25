import Character from "../../Objects/src/Character";
import ThunderStrikesTrigger from "../../Triggers/ThunderStrikesTrigger";
import Item from "../Item";
import Forging from "./Forging";

export default class ThunderStrikes extends Forging {
    value: number = 0
    trigger: any
   
    constructor(item: Item){
        super(item)
        this.max_value = 20
        this.name = 'thunder strikes'
        this.description = 'when your pierce enemy create 3 lightning bolts that strike behind the target'
        this.gold_cost = 12
    }

    forge(player: Character){
        if(this.canBeForged() && this.costEnough()){
            if(this.canBeForged() && this.costEnough()){
                if(!this.trigger){
                    this.trigger = new ThunderStrikesTrigger()
                    player.triggers_on_pierce.push(this.trigger)
                }
                this.trigger.chance += 5
                
                this.payCost()
                this.value += 5
            }
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