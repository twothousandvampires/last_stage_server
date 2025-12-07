import ITrigger from '../Interfaces/Itrigger'
import Character from '../Objects/src/Character'
import Fortify from '../Status/Fortify'

export default class UnhumanFortitudeTrigger implements ITrigger {
    cd: number = 2000
    last_trigger_time: number = 0
    chance: number = 30
    name: string = 'unhuman fortitude'
    description: string = 'Grants a 30% chance to gain fortification equal to your durability'

    getTriggerChance(): number {
        return this.chance
    }

    trigger(player: Character, target: any = undefined) {
        let s = new Fortify(player.level.time)
        s.setPower(player.durability)
        s.setDuration(5000)

        player.level.setStatus(player, s, true)
    }
}
