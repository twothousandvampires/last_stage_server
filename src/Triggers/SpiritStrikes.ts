import ITrigger from '../Interfaces/Itrigger'
import Character from '../Objects/src/Character'
import Unit from '../Objects/src/Unit'

export default class SpiritStrikes implements ITrigger {

    cd: number = 2000
    last_trigger_time: number = 0
    chance: number = 7
    name: string = 'spirit strikes'
    description: string = 'Then you impact there is a chance to get ward'

    getTriggerChance(): number {
        return this.chance
    }

    trigger(player: Character, target: Unit) {
        player.addWard(1)
    }
}
