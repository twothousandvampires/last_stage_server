import Func from "../Func";
import BoneArmour from "../Objects/Effects/BoneArmour";
import BoneArmourExplosion from "../Objects/Effects/BoneArmourExplosion";
import Effect from "../Objects/Effects/Effects";
import Character from "../Objects/src/Character";
import Item from "./Item";

    export default class WallOfBones extends Item{
        max_stacks: number
        end_timeout: any
        stack_count: number
        effect: Effect | undefined
        explode_chance: number
        cd: boolean
        power: number

        constructor(){
            super()
            this.max_stacks = 10
            this.stack_count = 0
            this.explode_chance = 40
            this.cd = false
            this.power = 0
        }
        equip(character: Character): void {
            character.onKillTriggers.push(this)
        }

        canBeForged(character: Character): boolean {
            return this.power < 3
        }
                        
        forge(character: Character): void {
            this.power ++   
        }
      
        trigger(character: Character){
            if(this.cd) return

            if(this.effect){
                if(this.effect.isMax()){
                    this.effect.clear()
                    // ------
                    this.effect = undefined
                    // ------
                    let explosion_effect = new BoneArmourExplosion(character.level)
                    explosion_effect.setPoint(character.x, character.y)

                    character.level.effects.push(explosion_effect)
                    // ------
                    let targets = character.level.enemies.concat(character.level.players.filter(elem => elem != character))
                    let box = character.getBoxElipse()
                    box.r = 20
    
                    for(let i = 0; i < targets.length; i++){
                        let target = targets[i]
                        if(Func.elipseCollision(box, target.getBoxElipse())){
                            target.takeDamage(character)
                        }
                    }
    
                    this.cd = true
                    setTimeout(() => {
                        this.cd = false
                    }, 10000)
                }
                else{
                    this.effect.update()
                }
            }
            else{
                let effect = new BoneArmour(character.level)
            
                effect.setOwner(character)
                effect.update(this.power * 2000)
                effect.producer = this
                this.effect = effect

                character.level.bindedEffects.push(effect)
            }
        }
    }