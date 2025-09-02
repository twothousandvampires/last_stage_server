import Func from "../Func";
import Character from "../Objects/src/Character";
import Chance from "./Forgings/Chance";
import Count from "./Forgings/Count";
import Distance from "./Forgings/Distance";
import Item from "./Item";

export default class FlameRing extends Item{

    constructor(){
        super()
        this.chance = 40
        this.distance = 15
        this.name = 'flame ring'
        this.type = 3
        this.forge = [
            new Chance(this),
            new Distance(this),
            new Count(this),
        ]
    }

    equip(character: Character): void {
        character.when_hited_triggers.push(this)
    }
    
    trigger(character: Character){
        if(Func.chance(this.chance)){
            let targets = character.level.enemies.concat(character.level.players.filter(elem => elem != character))
            targets = targets.filter(elem => Func.distance(elem, character) <= this.distance)

            for(let i = 0; i < this.count; i++){
                let target  = targets[Math.floor(Math.random() * targets.length)]

                if(target && !target.is_dead){
                    target.takeDamage(character, {
                        'burn': true
                    })
                }
            }  
        }
    }
}