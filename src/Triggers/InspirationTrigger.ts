import Func from '../Func'
import ITrigger from '../Interfaces/ITrigger'
import HeavenRay from '../Objects/Effects/HeavenRay'
import Character from '../Objects/src/Character'

export default class InspirationTrigger implements ITrigger {
    cd: number = 2000
    last_trigger_time: number = 0
    chance: number = 0
    name: string = 'inspiration'
    description: string =
        'Gives a chance depending on your perception get maximum energy when you get energy'

    getTriggerChance(player: Character | undefined): number {
        if (player) {
            return Math.round(player.perception / 2)
        }
        return 0
    }

    trigger(player: Character) {
        let e = new HeavenRay(player.level)
        e.setPoint(player.x, player.y)

        player.level.addEffect(e)
        player.resource = player.maximum_resources
    }
}
