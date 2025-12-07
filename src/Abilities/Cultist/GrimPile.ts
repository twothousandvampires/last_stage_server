import Cultist from '../../Objects/src/PlayerClasses/Cultist'
import CultistAbility from './CultistAbility'
import GrimPileTotem from '../../Objects/src/Piles/GrimPile'

export default class GrimPile extends CultistAbility {
    distance: 25
    increased_effect: boolean
    resistance: boolean

    constructor(owner: Cultist) {
        super(owner)
        this.name = 'grim pile'
        this.increased_effect = false
        this.resistance = false
        this.distance = 25
        this.cost = 3
        this.cd = 6000
        this.mastery_chance = 35
    }

    impact() {
        let rel_distance = Math.sqrt(
            (this.owner.x - this.owner.c_x) ** 2 + (this.owner.y - this.owner.c_y) ** 2
        )

        this.owner.level.sounds.push({
            name: 'bone cast',
            x: this.owner.x,
            y: this.owner.y,
        })

        let distance = rel_distance > this.distance ? this.distance : rel_distance

        let hit_x = this.owner.x + Math.sin(this.owner.attack_angle) * distance
        let hit_y = this.owner.y + Math.cos(this.owner.attack_angle) * distance

        let totem_power = this.owner.getSecondResource()

        let pile = new GrimPileTotem(this.owner.level, totem_power)
        pile.increased_effect = this.increased_effect
        pile.resistance = this.resistance

        pile.setPoint(hit_x, hit_y)

        this.owner.level.enemies.push(pile)

        this.afterUse()
    }
}
