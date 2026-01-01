import ITrigger from '../Interfaces/Itrigger'
import Character from '../Objects/src/Character'
import Unit from '../Objects/src/Unit'

export default class BreakingBonesTrigger implements ITrigger {

    cd: number = 500
    last_trigger_time: number = 0
    chance: number = 50
    name: string = 'breaking bones'
    description: string = 'When you crush enemy, where is a chance to reduce their move speed'

    getTriggerChance(): number {
        return this.chance
    }

    trigger(player: Character, enemy: Unit) {
        if(!enemy) return

        enemy.move_speed_penalty -= 25
    }
}