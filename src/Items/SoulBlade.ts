import Func from "../Func";
import Soul from "../Objects/Effects/Soul";
import Character from "../Objects/src/Character";
import { Enemy } from "../Objects/src/Enemy/Enemy";
import Item from "./Item";

export default class SoulBlade extends Item{

    frequency: number = 4000
    last_trigger: number = 0
    chance: number = 2
    max_chance: number = 10

    constructor(){
        super()
        this.name = 'soul blade'
        this.type = 1
        this.description = 'when you kill enemy there is a chance to get ward'
    }
    
    getSpecialForgings(): string[] {
        return ['frequency', 'chance']
    }

    equip(character: Character): void {
        character.triggers_on_kill.push(this)
    }

    trigger(player: Character, enemy: Enemy){
        if(this.disabled) return
        if(Func.notChance(this.chance, player.is_lucky)) return

        if(player.level.time - this.last_trigger >= this.frequency){
            this.last_trigger = player.level.time

            let e = new Soul(player.level)
            e.setPoint(enemy.x, enemy.y)
            player.level.effects.push(e)

            player.addWard(1)
        }
    }
}