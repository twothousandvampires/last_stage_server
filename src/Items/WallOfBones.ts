import Func from "../Func";
import BoneArmour from "../Objects/Effects/BoneArmour";
import BoneArmourExplosion from "../Objects/Effects/BoneArmourExplosion";
import Character from "../Objects/src/Character";
import Item from "./Item";

    export default class WallOfBones extends Item {

        end_timeout: any
        stack_count: number
        effect: BoneArmour | undefined
        explode_chance: number
        delete_timeout: any

        constructor(){
            super()
            this.stack_count = 0
            this.explode_chance = 40
            this.name = 'wall of bones'
            this.count = 10
            this.type = 2
            this.duration = 6000
            this.description = 'if you kill an enemy, you receive a bone charge that increases your armor. If you reach the maximum charge (default 10), there is a chance that the charges will explode and injure enemies'
        }

        equip(character: Character): void {
            character.triggers_on_kill.push(this)
        }

        getSpecialForgings(): string[] {
            return ['count', 'duration', 'bones when block']
        }
            
        remove(character){
            if(!this.effect) return

            character.level.deleted.push(this.effect.id)
            character.level.binded_effects = character.level.binded_effects.filter(elem => elem != this.effect)
            this.effect = undefined

            character.armour_rate -= this.stack_count
            this.stack_count = 0

            character.emitStatusEnd('wall of bones')
        }

        trigger(character: Character){
            if(this.disabled) return  
            
            if(this.effect){
                if(this.stack_count >= this.count && Func.chance(this.explode_chance)){
                    this.remove(character)
                    
                    let explosion_effect = new BoneArmourExplosion(character.level)
                    explosion_effect.setPoint(character.x, character.y)
                    character.level.effects.push(explosion_effect)
                    
                    let targets = character.level.enemies.concat(character.level.players.filter(elem => elem != character))
                    let box = character.getBoxElipse()
                    box.r = 20
    
                    for(let i = 0; i < targets.length; i++){
                        let target = targets[i]
                        if(Func.elipseCollision(box, target.getBoxElipse())){
                            target.takeDamage()
                        }
                    }
                }
                else{
                    if(this.stack_count < this.count){
                        this.stack_count ++
                        character.armour_rate ++
                    }
                
                    character.newStatus({
                        name: 'wall of bones',
                        duration: undefined,
                        desc: 'armour is increased(' + this.stack_count + ')'
                    })
                    
                    clearTimeout(this.delete_timeout)
                    this.delete_timeout = setTimeout(() => {
                        this.remove(character)
                    }, this.duration)
                }
            }
            else{
                this.stack_count ++
                character.armour_rate ++

                let effect = new BoneArmour(character.level)
            
                effect.setOwner(character)
                this.effect = effect

                character.level.binded_effects.push(effect)

                character.newStatus({
                    name: 'wall of bones',
                    duration: undefined,
                    desc: 'armour is increased(' + this.stack_count + ')'
                })

                this.delete_timeout = setTimeout(() => {
                    this.remove(character)
                }, this.duration)
            }
        }
    }