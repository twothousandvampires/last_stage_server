import Character from "../../Objects/src/Character";
import ExplodeEnemyWhenGetEnergy from "../../Triggers/ExplodeEnemyWhenGetEnergy";
import Item from "../Item";
import Forging from "./Forging";

export default class Overcharge extends Forging {5
    value: number = 0
   
    constructor(item: Item){
        super(item)
        this.max_value = 20
        this.name = 'overcharge'
        this.description = 'gives a chance to explode nearby corpse when you get energy'
        this.gold_cost = 12
    }

    forge(player: Character){
        if(this.canBeForged() && this.costEnough()){
            let trigger = player.triggers_on_get_energy.find(elem => elem instanceof ExplodeEnemyWhenGetEnergy)

            if(trigger){
                trigger.chance += 5
            }
            else{
                let t = new ExplodeEnemyWhenGetEnergy()
                t.chance = 5

                player.triggers_on_get_energy.push(t)
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