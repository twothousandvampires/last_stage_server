import ITrigger from '../Interfaces/Itrigger'
import Character from '../Objects/src/Character'

export default class WardWhenArmourBlock implements ITrigger {
    cd: number = 1500
    last_trigger_time: number = 0
    chance: number = 0
    name: string = 'enchanted armour'
    description: string = 'Give a chance to get ward when you block hit by armour'

    getTriggerChance(): number {
        return this.chance
    }

    trigger(player: Character) {
        player.addWard(1)
    }
}