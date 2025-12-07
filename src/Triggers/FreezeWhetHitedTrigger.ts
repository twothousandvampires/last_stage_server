import Func from '../Func'
import ITrigger from '../Interfaces/Itrigger'
import FrostExplosionSmall from '../Objects/Effects/FrostExplosionSmall'
import Character from '../Objects/src/Character'
import Unit from '../Objects/src/Unit'

export default class FreezeWhetHitedTrigger implements ITrigger {
    cd: number = 1200
    last_trigger_time: number = 0
    chance: number = 0
    name: string = 'icy halo'
    description: string = 'Сhance to freeze enemies in radius when getting hit'

    getTriggerChance(): number {
        return this.chance
    }

    trigger(player: Character, target: Unit) {
        let box = player.getBoxElipse()

        if (target) {
            box = target.getBoxElipse()
        }

        box.r = 10

        let targets = player.level.enemies
            .concat(player.level.players.filter(elem => elem != player))
            .filter(elem => !elem.is_dead && Func.elipseCollision(elem.getBoxElipse(), box))

        for (let i = 0; i < targets.length; i++) {
            let target = targets[i]

            target.setFreeze(2500)

            let e = new FrostExplosionSmall(player.level)
            e.setPoint(target.x, target.y)

            player.level.effects.push(e)
        }
    }
}
