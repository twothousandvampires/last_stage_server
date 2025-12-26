import ITrigger from '../Interfaces/Itrigger'
import Character from '../Objects/src/Character'
import Unit from '../Objects/src/Unit'

export default class BreakingArmorTrigger implements ITrigger {

    cd: number = 1000
    last_trigger_time: number = 0
    chance: number = 50
    name: string = 'breaking armour'
    description: string = 'When you crush enemy, where is a chance to reduce their armour'

    getTriggerChance(): number {
        return this.chance
    }

    trigger(player: Character, enemy: Unit) {
        if(!enemy) return

        enemy.armour_rate -= 25
    }
}