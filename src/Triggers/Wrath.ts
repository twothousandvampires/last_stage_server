import Func from '../Func'
import ITrigger from '../Interfaces/ITrigger'
import HeavenRay from '../Objects/Effects/HeavenRay'
import Character from '../Objects/src/Character'

export default class Wrath implements ITrigger {
    cd: number = 3000
    last_trigger_time: number = 0
    name: string = 'wrath'
    chance: number = 0
    description: string = 'Gives a chance to rain down divine wrath on enemies'

    getTriggerChance(player: Character): number {
        return this.chance
    }

    trigger(player: Character, target: any) {
        let targets = []
        if (target) {
            targets = player.level.enemies
                .filter(elem => !elem.is_dead && Func.distance(elem, target) <= 20)
                .slice(0, 12)
        } else {
            targets = player.level.enemies
                .filter(elem => !elem.is_dead && Func.distance(elem, player) <= 20)
                .slice(0, 12)
        }

        targets.forEach(elem => {
            elem.takeDamage(player)
            let e = new HeavenRay(player.level)
            e.setPoint(elem.x, elem.y)

            player.level.effects.push(e)
        })
    }
}
