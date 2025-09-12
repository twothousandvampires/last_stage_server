import Func from "../Func";
import FrostNova from "../Objects/Effects/FrostNova";
import Character from "../Objects/src/Character";
import Item from "./Item";

export default class GlacialChain extends Item{

    constructor(){
        super()
        this.chance = 20
        this.name = 'glacial chain'
        this.type = 1
        this.description = 'after using your non-utility skill you have a 25% chance to spell Frost Wave'
    }

    getSpecialForgings() {
        return ['nova when hit', 'chance']
    }

    equip(character: Character): void {
        character.use_not_utility_triggers.push(this)
    }

    trigger(character: Character){
        if(this.disabled) return
        
        if(Func.chance(this.chance + (this.forge_power * 5))){
            let effect = new FrostNova(character.level)
            effect.setPoint(character.x, character.y)
    
            character.level.effects.push(effect)

            let targets = character.level.enemies.concat(character.level.players.filter(elem => elem != character))
            let box = character.getBoxElipse()
            box.r = 12 + (this.forge_power * 2)
            for(let i = 0; i < targets.length; i++){
                let target = targets[i]
                if(Func.elipseCollision(box, target.getBoxElipse())){
                    target.setFreeze(2000)
                }
            }
        }
    }
}