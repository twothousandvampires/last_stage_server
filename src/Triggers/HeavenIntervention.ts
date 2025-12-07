import Func from '../Func'
import ITrigger from '../Interfaces/ITrigger'
import HeavenRay from '../Objects/Effects/HeavenRay'
import Character from '../Objects/src/Character'

export default class HeavenIntervention implements ITrigger {
    cd: number = 500
    last_trigger_time: number = 0
    chance: number = 25
    name: string = 'heaven intervention'
    description: string =
        'Gives a chance that the heavens will help you, chance is increased by your power'

    getTriggerChance(player: Character): number {
        return this.chance + player.power
    }

    trigger(player: Character) {
        let targets = player.level.enemies.filter(
            elem => !elem.is_dead && Func.distance(elem, player) <= 20
        )

        let random = targets[Math.floor(Math.random() * targets.length)]

        if (!random) return

        let e = new HeavenRay(player.level)
        e.setPoint(random.x, random.y)

        random.takeDamage(player, {})

        player.level.effects.push(e)
    }
}
