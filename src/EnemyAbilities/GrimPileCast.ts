import Func from '../Func'
import SpiritCircle from '../Objects/Effects/SpiritCircle'
import Enemy from '../Objects/src/Enemy/Enemy'
import GrimPileStatus from '../Status/GrimPileStatus'

export default class GrimPileCast {
    cooldown: number = 3000
    last_used_time = 0
    radius: number = 14

    constructor(
        private inc_effect: boolean,
        private add_resistace: boolean
    ) {}

    canUse(pile: Enemy) {
        return (
            pile.level.time - this.last_used_time >= this.cooldown &&
            pile.target &&
            Func.distance(pile, pile.target) <= this.radius
        )
    }

    use(pile: Enemy) {
        this.last_used_time = pile.level.time

        let e = new SpiritCircle(pile.level)
        e.setPoint(pile.x, pile.y)

        pile.level.addEffect(e)

        pile.level.players.forEach(elem => {
            if (Func.distance(pile, elem) <= this.radius) {
                let status = new GrimPileStatus(pile.level.time)
                if (this.add_resistace) {
                    status.add_resistance += 15
                }
                if (this.inc_effect) {
                    status.add_armour += 10
                    status.add_speed += 10
                }

                status.setDuration(6000)

                pile.level.setStatus(elem, status, true)
            }
        })
    }
}
