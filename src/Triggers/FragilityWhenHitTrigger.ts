import ITrigger from '../Interfaces/Itrigger'
import Character from '../Objects/src/Character'
import Unit from '../Objects/src/Unit'
import Fragility from '../Status/Fragility'

export default class FragilityWhenHitTrigger implements ITrigger {
    cd: number = 2000
    last_trigger_time: number = 0
    name: string = 'disintegration'
    description: string = 'Your hits have a chance to apply fragility on enemies'

    constructor(public chance: number = 100) {}

    getTriggerChance(player: Character | undefined): number {
        return this.chance
    }

    trigger(player: Character, target: Unit) {
        let s = new Fragility(player.level.time)
        s.setDuration(4000)

        player.level.setStatus(target, s, true)
    }
}
