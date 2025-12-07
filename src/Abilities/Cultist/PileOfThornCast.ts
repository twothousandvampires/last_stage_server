import Cultist from '../../Objects/src/PlayerClasses/Cultist'
import CultistAbility from './CultistAbility'
import PileOfThorns from '../../Objects/src/Piles/PileOfThorns'

export default class PileOfThornCast extends CultistAbility {
    distance: 25
    ring_of_pain: boolean = false
    collection_of_bones: boolean = false

    constructor(owner: Cultist) {
        super(owner)
        this.name = 'pile of thorns'
        this.distance = 25
        this.cost = 6
        this.need_to_pay = true
        this.mastery_chance = 35
        this.cd = 5000
    }

    impact() {
        this.owner.level.sounds.push({
            name: 'bone cast',
            x: this.owner.x,
            y: this.owner.y,
        })

        let rel_distance = Math.sqrt(
            (this.owner.x - this.owner.c_x) ** 2 + (this.owner.y - this.owner.c_y) ** 2
        )

        let distance = rel_distance > this.distance ? this.distance : rel_distance

        let hit_x = this.owner.x + Math.sin(this.owner.attack_angle) * distance
        let hit_y = this.owner.y + Math.cos(this.owner.attack_angle) * distance

        let pile = new PileOfThorns(this.owner.level, this.ring_of_pain)
        pile.collection_of_bones = this.collection_of_bones

        pile.setPoint(hit_x, hit_y)

        this.owner.level.enemies.push(pile)

        this.afterUse()
    }
}
