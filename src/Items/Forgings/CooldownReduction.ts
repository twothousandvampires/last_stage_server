import Character from "../../Objects/src/Character";
import Item from "../Item";
import Forging from "./Forging";

export default class CooldownReduction extends Forging{

    value: number = 0

    constructor(item: Item){
        super(item)
        this.max_value = 90
        this.name = 'cooldown reduction'
        this.stat = 'reduces your cooldowns'
        this.gold_cost = 6
    }

    forge(){
        if(this.canBeForged() && this.costEnough()){
            this.value += 2
            this.item.player.cd_reduction += 2
            this.payCost()
        }
    }

    getValue(){
        return this.value
    }

    canBeForged(): boolean {
        if(!this.item || !this.item.player) return false

        return this.item.player.durability < this.max_value
    }
}