import ITrigger from '../Interfaces/ITrigger'
import Character from '../Objects/src/Character'

export default class WardAfterEnlightTrigger implements ITrigger {
    
    name: string = 'afterlight'
    description: string = 'You gain  ward'
    chance: number = 100
    last_trigger_time: number = 0
    cd: number = 2000

    getTriggerChance(player: Character | undefined): number {
        return this.chance
    }

    trigger(player: Character) {
        player.addWard(3)
    }
}
