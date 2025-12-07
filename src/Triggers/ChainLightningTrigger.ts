import Func from '../Func'
import ITrigger from '../Interfaces/ITrigger'
import { ChainLightning } from '../Objects/Projectiles/ChainLightning'
import Character from '../Objects/src/Character'

export default class ChainLightningTrigger implements ITrigger {
    chance: number = 5
    name: string = 'chain lightning'
    description: string = 'Creates a lightning that hit enemy and jupms to another 15 times'
    last_trigger_time: number = 0
    cd: number = 0

    getTriggerChance(): number {
        return this.chance
    }

    async trigger(player: Character) {
        let l = new ChainLightning(player.level)

        l.setOwner(player)
        l.setPoint(player.x, player.y)
        l.setAngle(Math.random() * 6.28)

        player.level.projectiles.push(l)
    }
}
