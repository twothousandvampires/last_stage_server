import Func from '../Func'
import ITrigger from '../Interfaces/ITrigger'
import Character from '../Objects/src/Character'
import Power from '../Status/Power'

export default class FromDefendToAttackTrigger implements ITrigger {
    cd: number = 1000
    last_trigger_time: number = 0
    chance: number = 30
    name: string = 'from defense to attack'
    description: string = 'You have a chance to increase your power'

    getTriggerChance(player: Character): number {
        return this.chance
    }

    trigger(player: Character) {
        let s = new Power(player.level.time)
        s.setPower(10)
        s.setDuration(8000)

        player.level.setStatus(player, s, true)
    }
}
