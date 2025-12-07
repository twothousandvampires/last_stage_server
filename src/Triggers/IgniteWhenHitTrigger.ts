import Func from '../Func'
import ITrigger from '../Interfaces/ITrigger'
import Character from '../Objects/src/Character'
import Unit from '../Objects/src/Unit'
import Ignite from '../Status/Ignite'

export default class IgniteWhenHitTrigger implements ITrigger {
    cd: number = 1200
    last_trigger_time: number = 0
    chance: number = 0
    name: string = 'flaming'
    description: string = 'Give a chance to ignite enemies in radius when hitting target'

    getTriggerChance(player: Character | undefined): number {
        return this.chance
    }

    trigger(player: Character, target: Unit) {
        let box = target.getBoxElipse()
        box.r = 12

        let targets = player.level.enemies
            .concat(player.level.players.filter(elem => elem != player))
            .filter(elem => !elem.is_dead && Func.elipseCollision(elem.getBoxElipse(), box))

        for (let i = 0; i < targets.length; i++) {
            let target = targets[i]

            let s = new Ignite(player.level.time)
            s.setDuration(6000)
            s.setPower(30)
            s.provider = player

            player.level.setStatus(target, s, true)
        }
    }
}
