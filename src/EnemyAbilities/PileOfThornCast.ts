import Func from '../Func'
import BoneArmourExplosion from '../Objects/Effects/BoneArmourExplosion'
import Enemy from '../Objects/src/Enemy/Enemy'
import PileOfThorns from '../Objects/src/Piles/PileOfThorns'

export default class PileOfThornCast {
    last_used_time = 0

    constructor(
        private pile: PileOfThorns,
        private radius: number = 12,
        private cooldown = 3500
    ) {}

    canUse(pile: Enemy) {
        return pile.level.time - this.last_used_time >= this.cooldown
    }

    use(pile: Enemy) {
        this.last_used_time = pile.level.time

        let e = new BoneArmourExplosion(pile.level)
        e.setPoint(pile.x, pile.y)

        pile.level.addEffect(e)

        pile.level.enemies.forEach(elem => {
            if (!elem.is_dead && elem != this.pile && Func.distance(pile, elem) <= this.radius) {
                elem.takeDamage()
                if (this.pile.collection_of_bones && elem.is_dead) {
                    this.pile.kill_count++
                }
            }
        })
    }
}
