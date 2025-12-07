import Ability from '../Abilities/Ability'
import Func from '../Func'
import RocksFromCeil from '../Objects/Effects/RocksFromCeil'
import Character from '../Objects/src/Character'
import Mastery from './Mastery'

export default class FallingStones extends Mastery {
    constructor() {
        super()
        this.name = 'falling stones'
        this.description =
            'When you start using an ability, there is a chance to drop rocks on enemies.'
    }

    async trigger(player: Character, ability: Ability) {
        let count = 3

        let zones = 6.28 / count

        for (let i = 1; i <= count; i++) {
            await Func.sleep(300)

            let min_a = (i - 1) * zones
            let max_a = i * zones

            let angle = Math.random() * (max_a - min_a) + min_a
            let distance_x = Func.random(8, 16)
            let distance_y = Func.random(8, 16)
            let effect = new RocksFromCeil(player.level)

            effect.setPoint(
                player.x + Math.sin(angle) * distance_x,
                player.y + Math.cos(angle) * distance_y
            )

            player.level.addEffect(effect)

            setTimeout(() => {
                let box = effect.getBoxElipse()
                box.r = 6

                player.level.enemies.forEach(elem => {
                    if (!elem.is_dead && Func.elipseCollision(elem.getBoxElipse(), box)) {
                        elem.setStun(3000)
                        elem.takeDamage(player, {})
                    }
                })
            }, 500)
        }
    }
}
