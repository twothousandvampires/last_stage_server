import ITrigger from '../Interfaces/Itrigger'
import Character from '../Objects/src/Character'

export default class UnbreakableSpirit implements ITrigger {

    chance: number = 10
    name: string = 'unbreakable spirit'
    description: string = 'When you get damage where is a chance to restore 1 life'
    last_trigger_time: number = 0
    cd: number = 5000

    getTriggerChance(): number {
        return this.chance
    }

    async trigger(player: Character) {
        player.addLife(1)
    }
}