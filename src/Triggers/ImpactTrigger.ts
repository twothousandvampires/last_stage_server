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
        
        let rating = player.getImpactRating()

        while(rating - 100 > 0){
            rating -= 100

            if(Func.chance(rating)){
                let a = Func.random() * 6.28
                let d = Func.random(2, 6)

                let x = enemy.x + Math.sin(a) * d
                let y = enemy.y + Math.cos(a) * d

                let e = new Impact(player.level)
                e.setPoint(x, y)
                player.level.effects.push(e)

                let box = player.getBoxElipse()
                box.x = x
                box.y = y
                box.r = player.impact_radius

                player.level.enemies.forEach(elem => {
                    if (!elem.is_dead && Func.elipseCollision(box, elem.getBoxElipse())){
                        elem.takePureDamage(player, {
                            damage_value: damage_value,
                        })
                    }
                })
            }
        }
    }
}
