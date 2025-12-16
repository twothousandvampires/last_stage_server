import Func from '../Func'
import ITrigger from '../Interfaces/Itrigger'
import Impact from '../Objects/Effects/Impact'
import Character from '../Objects/src/Character'

export default class ImpactTrigger implements ITrigger {

    cd: number = 1500
    last_trigger_time: number = 0
    name: string = 'impact'
    description: string = ''
    hidden: boolean = true
    chance: number = 0

    getTriggerChance(player: Character): number {
        return player.getImpactRating()
    }

    trigger(player: Character, enemy: any, damage_value: number) {
        if (!enemy) return
        // force
        this.last_trigger_time = player.level.time

        player.level.addSound('impact', player.x, player.y)
        let e = new Impact(player.level)
        e.setPoint(enemy.x, enemy.y)
        player.level.effects.push(e)

        player.impactHit(enemy, damage_value)

        player.level.enemies.forEach(elem => {
            if (!elem.is_dead && Func.distance(enemy, elem) <= player.impact_radius && elem != enemy) {
                elem.takePureDamage(player, {
                    damage_value: damage_value,
                })
            }
        })  
    }
}
