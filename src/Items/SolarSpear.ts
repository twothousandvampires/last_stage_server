import Func from "../Func";
import LightNova from "../Objects/Effects/LightNova";
import Character from "../Objects/src/Character";
import { Enemy } from "../Objects/src/Enemy/Enemy";
import Item from "./Item";

export default class SolarSpear extends Item{

    frequency: number = 4000
    last_trigger: number = 0

    constructor(){
        super()
        this.name = 'solar spear'
        this.type = 1
        this.description = 'when you pierce enemy there is a chance to create light nova which heals allies'
    }
    
    getSpecialForgings(): string[] {
            return ['frequency']
    }

    equip(character: Character): void {
        character.on_hit_triggers.push(this)
    }

    trigger(player: Character, enemy: Enemy){
        if(this.disabled) return
        if(enemy.armour_rate >= player.pierce) return

        if(Func.chance(player.pierce - enemy.armour_rate, player.is_lucky)){
            if(player.level.time - this.last_trigger >= this.frequency){
                this.last_trigger = player.level.time

                let e = new LightNova(player.level)
                e.setPoint(enemy.x, enemy.y)
                player.level.effects.push(e)

                player.level.players.forEach(elem => {
                    if(Func.distance(elem, player) <= 12){
                        elem.addLife()
                    }
                })
            }
        }
    }
}