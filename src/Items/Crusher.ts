import Func from '../Func'
import ITrigger from '../Interfaces/Itrigger'
import BloodBonesExplode from '../Objects/Effects/BloodBonesExplode'
import BoneArmourExplosion from '../Objects/Effects/BoneArmourExplosion'
import Character from '../Objects/src/Character'
import Unit from '../Objects/src/Unit'
import Item from './Item'

export default class Crusher extends Item implements ITrigger{

    last_trigger_time: number = 0

    constructor() {
        super()
        this.name = 'crusher'
        this.type = 1
        this.chance = 35
        this.cd = 1000
        this.distance = 12
        this.description = 'increases crushing rating by 5 and give a chance that killed crushed enemy will explode and deal damage in radius'
    }

    equip(character: Character): void {
        character.triggers_on_kill.push(this)
    }

    getTriggerChance(player: Character | undefined): number {
        return this.chance
    }

    getSpecialForgings(): string[] {
        return ['chance']
    }

    trigger(character: Character, target: Unit) {
        if (this.disabled) return
        if (!target) return
        if (target.crushing <= 0) return

        let e = new BloodBonesExplode(character.level)
        e.setPoint(target.x, target.y)
        character.level.effects.push(e)
        target.exploded = true

        character.level.enemies.forEach(elem => {
            if (!elem.is_dead && Func.distance(elem, target) <= this.distance) {
                elem.takeDamage(character, {})
            }
        })     
    }
}