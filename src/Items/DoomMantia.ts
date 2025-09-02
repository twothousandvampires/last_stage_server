import Func from "../Func";
import Character from "../Objects/src/Character";
import ArmourRate from "./Forgings/ArmourRate";
import Chance from "./Forgings/Chance";
import Distance from "./Forgings/Distance";
import Item from "./Item";

export default class DoomMantia extends Item {
   
    constructor(){
        super()
        this.chance = 30
        this.distance = 20
        this.name = 'doom mantia'
        this.type = 2
        this.forge = [
            new Distance (this),
            new Chance(this)
        ]
    }

    equip(character: Character): void {
        character.player_take_lethal_damage_triggers.push(this)
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