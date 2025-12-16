import Func from '../Func'
import ITrigger from '../Interfaces/Itrigger'
import FragilityEffect from '../Objects/Effects/Fragility'
import Character from '../Objects/src/Character'
import Unit from '../Objects/src/Unit'
import Fragility from '../Status/Fragility'

export default class CrystilizingHits implements ITrigger {

    cd: number = 10000
    last_trigger_time: number = 0
    name: string = 'crystilizing hits'
    description: string = 'Provides a chance to inflict fragility on enemies in a small radius on hit'

    constructor(public chance: number = 100) {}

    getTriggerChance(player: Character | undefined): number {
        return this.chance
    }

    trigger(player: Character, target: Unit) {
        if(!target) return

        let e = new FragilityEffect(player.level)
        e.setPoint(target.x, target.y)
        player.level.addEffect(e)

        player.level.enemies.forEach(elem => {
            if(!elem.is_dead && Func.distance(elem, target) <= 14){
                let s = new Fragility(player.level.time)
                s.setDuration(8000)

                player.level.setStatus(elem, s, true)
            }
        })     
    }
}
