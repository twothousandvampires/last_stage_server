import Character from "../../Objects/src/Character";
import LightningWhenUseAbilityTrigger from "../../Triggers/LightningWhenUseAbilityTrigger";
import Item from "../Item";
import Forging from "./Forging";

export default class LightningWhenUseSkill extends Forging {

    value: number = 0
   
    constructor(item: Item){
        super(item)
        this.max_value = 20
        this.name = 'electrification'
        this.description = 'chance to realise lightnings when use skill'
        this.gold_cost = 12
    }

    forge(player: Character){
        if(this.canBeForged() && this.costEnough()){
            let trigger = player.triggers_on_use_not_utility.find(elem => elem instanceof LightningWhenUseAbilityTrigger)

            if(trigger){
                trigger.chance += 3
            }
            else{
                let t = new LightningWhenUseAbilityTrigger()
                t.chance = 3

                player.triggers_on_use_not_utility.push(t)
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