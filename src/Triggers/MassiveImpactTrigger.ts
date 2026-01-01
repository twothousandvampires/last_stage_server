import Func from '../Func'
import ITrigger from '../Interfaces/ITrigger'
import Impact from '../Objects/Effects/Impact'
import Character from '../Objects/src/Character'

export default class MassiveImpactTrigger implements ITrigger{

    cd: number = 1000
    last_trigger_time: number = 0
    name: string = 'massive impact'
    description: string = 'Gives a chance, depending on your might to create additional impacts'
    chance: number = 0

    getTriggerChance(player: Character): number {
        return player.might * 3
    }

    trigger(player: Character, target: any = undefined, impact_damage: number = 1) {
        for (let i = 0; i < 3; i++) {
            let angle = Math.random() * 6.28

            let box = {
                x: target.x + Math.sin(angle) * Func.random(2, 5),
                y: target.y + Math.cos(angle) * Func.random(2, 5),
                r: player.impact_radius,
            }
            let e = new Impact(player.level)
            e.setPoint(box.x, box.y)

            player.level.effects.push(e)

            player.level.enemies.forEach(elem => {
                if (!elem.is_dead && Func.elipseCollision(box, elem.getBoxElipse())) {
                    elem.takePureDamage(player, {
                        damage_value: impact_damage,
                    })
                }
            })
        }      
    }
}
