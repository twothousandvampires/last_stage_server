import Func from '../Func'
import ITrigger from '../Interfaces/Itrigger'
import GroundHit from '../Objects/Effects/GroundHit'
import Character from '../Objects/src/Character'

export default class ShockWaveTrigger implements ITrigger {

    chance: number = 0
    name: string = 'shock wave'
    description: string = 'there is a chance to create 10 strikes around you that deal damage, the radius is chosen randomly'
    last_trigger_time: number = 0
    cd: number = 500

    getTriggerChance(): number {
        return this.chance
    }

    async trigger(player: Character) {
        let count = 10
        
        let zones = 6.28 / count

        for (let i = 1; i <= count; i++) {
            let min_a = (i - 1) * zones
            let max_a = i * zones

            let a = Math.random() * (max_a - min_a) + min_a

            let l = 1 - Math.abs(0.5 * Math.cos(a))

            let d = Func.random(6, 16)

            let n_x = Math.sin(a) * l * d
            let n_y = Math.cos(a) * l * d

            let e = new GroundHit(player.level)
            e.setPoint(player.x + n_x, player.y + n_y)
            player.level.addEffect(e)

            let box = player.getBoxElipse()
            box.x = e.x
            box.y = e.y
            box.r = 5

            player.level.enemies.forEach(elem => {
                if(!elem.is_dead && Func.elipseCollision(elem.getBoxElipse(), box)){
                    elem.takeDamage(player, {
                        explode: true
                    })
                }
            })
        }
    }
}
