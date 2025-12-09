import Func from '../Func'
import Impact from '../Objects/Effects/Impact'
import Character from '../Objects/src/Character'

export default class MassiveImpactTrigger {
    cd: number = 1000
    last_trigger_time: number = 0
    name: string = 'massive impact'
    description: string = 'Gives a chance, depending on your might to create additional impacts'

    trigger(player: Character, target: any = undefined, impact_damage: number = 1) {
        if (Func.notChance(player.might * 7, player.is_lucky)) return

        if (player.level.time - this.last_trigger_time >= this.cd) {
            this.last_trigger_time = player.level.time
            
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
                    if (Func.elipseCollision(box, elem.getBoxElipse()) && !elem.is_dead) {
                        elem.takeDamage(player, {
                            damage_value: impact_damage,
                        })
                    }
                })
            }
        }
    }
}
