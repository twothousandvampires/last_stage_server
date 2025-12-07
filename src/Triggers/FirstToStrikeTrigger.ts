import ITrigger from '../Interfaces/ITrigger'
import Character from '../Objects/src/Character'
import AttackAndCastSpeed from '../Status/AttackAndCastSpeed'

export default class FirstToStrikeTrigger implements ITrigger {
    cd: number = 1000
    last_trigger_time: number = 0
    chance: number = 30
    name: string = 'first to strike'
    description: string = 'You have a chance to increase your attack and cast speed'

    getTriggerChance(player: Character): number {
        return this.chance
    }

    trigger(player: Character) {
        let s = new AttackAndCastSpeed(player.level.time)
        s.setPower(60)
        s.setDuration(8000)

        player.level.setStatus(player, s, true)
    }
}
