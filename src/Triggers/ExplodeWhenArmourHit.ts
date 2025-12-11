import Func from '../Func'
import ITrigger from '../Interfaces/Itrigger'
import FireExplosion from '../Objects/Effects/FireExplosion'
import Character from '../Objects/src/Character'

export default class ExplodeWhenArmourHit implements ITrigger {
    cd: number = 1500
    last_trigger_time: number = 0
    chance: number = 0
    name: string = 'explosive armour'
    description: string = 'Give a chance to create explode around you when you block hit by armour'

    getTriggerChance(): number {
        return this.chance
    }

    trigger(player: Character) {
        let e = new FireExplosion(player.level)
        e.setPoint(player.x, player.y)

        player.level.addEffect(e)

        player.level.enemies.forEach(elem => {
            if (!elem.is_dead && Func.distance(player, elem) <= 14) {
                elem.takeDamage(player, {
                    burn: true,
                })
            }
        })
    }
}
