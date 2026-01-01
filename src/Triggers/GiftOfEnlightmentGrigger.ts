import Func from '../Func'
import ITrigger from '../Interfaces/Itrigger'
import GraceShard from '../Objects/Effects/GraceShard'
import Character from '../Objects/src/Character'

export default class GiftOfEnlightmentGrigger implements ITrigger {

    cd: number = 10000
    last_trigger_time: number = 0
    chance: number = 0
    name: string = 'gift of enlightenment'
    description: string = 'When you get enlightened there is a chance to create grace'

    getTriggerChance(): number {
        return this.chance
    }

    trigger(player: Character) {
        let c = new GraceShard(player.level)

        let a = Math.random() * 6.28

        let d = Func.random(5, 10)

        let x = player.x + Math.sin(a) * d
        let y = player.y + Math.cos(a) * d

        c.setPoint(x, y)
        player.level.binded_effects.push(c)
    }
}