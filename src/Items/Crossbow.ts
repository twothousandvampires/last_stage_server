import Func from '../Func'
import ITrigger from '../Interfaces/Itrigger'
import BoneArmourExplosion from '../Objects/Effects/BoneArmourExplosion'
import Character from '../Objects/src/Character'
import Item from './Item'

export default class Crossbow extends Item implements ITrigger{
    last_trigger_time: number = 0

    constructor() {
        super()
        this.name = 'crossbow'
        this.type = 1
        this.chance = 35
        this.cd = 2000
        this.distance = 12
        this.description = 'when you lead critical damage there is a chance to crushingw nearby enemies'
    }

    equip(character: Character): void {
        character.triggers_on_critical.push(this)
    }

    getTriggerChance(player: Character | undefined): number {
        return this.chance
    }

    getSpecialForgings(): string[] {
        return ['chance', 'frequency']
    }

    trigger(character: Character, target: any) {
        if (this.disabled) return
        if (!target) return

        let e = new BoneArmourExplosion(character.level)
        e.setPoint(target.x, target.y)
        character.level.effects.push(e)

        character.level.enemies.forEach(elem => {
            if (Func.distance(elem, target) <= this.distance) {
                elem.crushing ++
            }
        })     
    }
}
