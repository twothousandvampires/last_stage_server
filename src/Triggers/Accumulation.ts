import Func from '../Func'
import ITrigger from '../Interfaces/ITrigger'
import { MagicShard } from '../Objects/Projectiles/MagicShard'
import Character from '../Objects/src/Character'
import Unit from '../Objects/src/Unit'

export default class Accumulation implements ITrigger {
    cd: number = 1000
    last_trigger_time: number = 0
    count: number = 0
    name: string = 'accumulation'
    description: string = 'When you cast 10 spells, realise magick stars equals your courage'
    chance: number = 100

    getTriggerChance(player: Character | undefined): number {
        return this.chance
    }

    trigger(player: Character) {
        if (this.count >= 10) {
            let star_count = player.getSecondResource()

            let targets = player.level.enemies
                .filter(elem => !elem.is_dead && Func.distance(player, elem) < 15)
                .slice(0, star_count)

            targets.forEach(element => {
                let proj = new MagicShard(player.level)
                proj.setPoint(player.x, player.y)
                proj.setAngle(Func.angle(player.x, player.y, element.x, element.y))
                proj.setOwner(player)
                player.level.projectiles.push(proj)
            })

            this.count = 0
        } else {
            this.count++
        }
    }
}
