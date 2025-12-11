import Func from '../Func'
import ITrigger from '../Interfaces/Itrigger'
import BoneArmour from '../Objects/Effects/BoneArmour'
import BoneArmourExplosion from '../Objects/Effects/BoneArmourExplosion'
import Character from '../Objects/src/Character'
import Item from './Item'

export default class WallOfBones extends Item implements ITrigger {
    cd: number = 0
    last_trigger_time: number = 0
    end_timeout: any
    stack_count: number
    effect: BoneArmour | undefined
    delete_timeout: any

    constructor() {
        super()
        this.stack_count = 0
        this.name = 'wall of bones'
        this.count = 10
        this.type = 2
        this.duration = 12000
        this.chance = 25
        this.description =
            'if you get hit, you have a chance to receive a bone charge that increases your armor and fortification. If you reach the maximum charge (default 10), there is a chance that the charges will explode and injure enemies.'
    }

    equip(character: Character): void {
        character.triggers_on_get_hit.push(this)
    }

    getTriggerChance(): number {
        return 100
    }

    getSpecialForgings(): string[] {
        return ['count', 'duration', 'bones when block']
    }

    remove(character) {
        if (!this.effect) return

        character.level.deleted.push(this.effect.id)
        character.level.binded_effects = character.level.binded_effects.filter(
            elem => elem != this.effect
        )
        this.effect = undefined

        character.armour_rate -= this.stack_count
        character.fortify -= this.stack_count
        this.stack_count = 0

        character.emitStatusEnd('wall of bones')
    }

    trigger(character: Character) {
        if (this.disabled) return

        if (this.effect) {
            if (this.stack_count >= this.count && Func.chance(this.chance)) {
                this.remove(character)

                let explosion_effect = new BoneArmourExplosion(character.level)
                explosion_effect.setPoint(character.x, character.y)
                character.level.effects.push(explosion_effect)

                let targets = character.level.enemies.concat(
                    character.level.players.filter(elem => elem != character)
                )
                let box = character.getBoxElipse()
                box.r = 20

                for (let i = 0; i < targets.length; i++) {
                    let target = targets[i]
                    if (Func.elipseCollision(box, target.getBoxElipse())) {
                        target.takeDamage()
                    }
                }
            } else {
                if (this.stack_count < this.count) {
                    this.stack_count++
                    character.armour_rate++
                    character.fortify++
                }

                character.newStatus({
                    name: 'wall of bones',
                    duration: undefined,
                    desc: 'armour and fortification are increased(' + this.stack_count + ')',
                })

                clearTimeout(this.delete_timeout)
                this.delete_timeout = setTimeout(() => {
                    this.remove(character)
                }, this.duration)
            }
        } else {
            this.stack_count++
            character.armour_rate++
            character.fortify++

            character.level.addSound('bone cast', character.x, character.y)

            let effect = new BoneArmour(character.level)

            effect.setOwner(character)
            this.effect = effect

            character.level.binded_effects.push(effect)

            character.newStatus({
                name: 'wall of bones',
                duration: undefined,
                desc: 'armour and fortification are increased(' + this.stack_count + ')',
            })

            this.delete_timeout = setTimeout(() => {
                this.remove(character)
            }, this.duration)
        }
    }
}
