import Func from '../Func'
import ITrigger from '../Interfaces/Itrigger'
import { SwirlingIceProj } from '../Objects/Projectiles/SwirlingIceProj'
import Character from '../Objects/src/Character'

export default class Hurricane implements ITrigger {
    chance: number = 5
    name: string = 'hurricane'
    description: string = 'Creates 12 icicles'
    last_trigger_time: number = 0
    cd: number = 0

    getTriggerChance(): number {
        return this.chance
    }

    async trigger(player: Character) {
        let count = 12

        for (let i = 1; i <= count; i++) {
            await Func.sleep(Func.random(150, 300))

            let proj1 = new SwirlingIceProj(player.level, Func.random(3 * i, 3 * (i * 2)))
            proj1.setOwner(player)
            proj1.setAngle(Math.random() * 6.28)

            player.level.projectiles.push(proj1)
        }
    }
}
