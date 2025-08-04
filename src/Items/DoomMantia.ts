import Func from "../Func";
import Character from "../Objects/src/Character";
import Item from "./Item";

export default class DoomMantia extends Item{
    chance: number
    distance: number
    power: number

    constructor(){
        super()
        this.chance = 30
        this.distance = 20
        this.power = 0
    }

    canBeForged(character: Character): boolean {
        return this.power < 3
    }

    forge(character: Character): void {
        this.power ++
        this.chance += 5
    }

    equip(character: Character): void {
        character.playerTakeLethalDamageTriggers.push(this)
    }
    
    trigger(character: Character){
        if(Func.chance(this.chance)){
            let targets = character.level.enemies.concat(character.level.players.filter(elem => elem != character))
            targets = targets.filter(elem => Func.distance(elem, character) <= this.distance)

            let target  = targets[Math.floor(Math.random() * targets.length)]

            if(target){
                target.takeDamage(character, {
                    instant_death: true
                })
                character.can_be_lethaled = false
            }
        }
    }
}