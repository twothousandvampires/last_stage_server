import Func from '../Func'
import ITrigger from '../Interfaces/Itrigger'
import FlamyRing from '../Objects/Effects/FlamyRing'
import Character from '../Objects/src/Character'

export default class DamageInRadiusWhenEnlightnent implements ITrigger {
    cd: number = 2000
    last_trigger_time: number = 0
    name: string = 'fire burst'
    description: string = 'Deals fire damage in a large radius'
    chance: number = 100

    getTriggerChance(player: Character | undefined): number {
        return this.chance
    }

    trigger(player: Character) {
      
        let e = new FlamyRing(player.level)
        e.setPoint(player.x, player.y)

        player.level.addEffect(e)

        let enemies = player.level.enemies.filter(
            elem => !elem.is_dead && Func.distance(player, elem) <= 25
        )

        enemies.forEach(elem => {
            elem.takeDamage(player, {
                burn: true,
            })
        })
        
    }
}
