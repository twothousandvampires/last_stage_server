import Cultist from '../../Objects/src/PlayerClasses/Cultist'
import CultistAbility from './CultistAbility'
import RuneEffect from '../../Objects/Effects/Rune'
import Func from '../../Func'

export default class Rune extends CultistAbility {
    distance: number = 25
    runefield: boolean = false
    fast_detonation: boolean = false
    explosive: boolean = false
    second_detanation: boolean = false

    constructor(owner: Cultist) {
        super(owner)
        this.name = 'rune'
        this.mastery_chance = 5
    }

    async impact() {
        let rel_distance = Math.sqrt(
            (this.owner.x - this.owner.c_x) ** 2 + (this.owner.y - this.owner.c_y) ** 2
        )

        let distance = rel_distance > this.distance ? this.distance : rel_distance

        this.owner.level.sounds.push({
            name: 'cast',
            x: this.owner.x,
            y: this.owner.y,
        })

        let hit_x = this.owner.x + Math.sin(this.owner.attack_angle) * distance
        let hit_y = this.owner.y + Math.cos(this.owner.attack_angle) * distance

        let rune = new RuneEffect(this.owner.level)
        rune.fast_detonation = this.fast_detonation
        rune.explosive = this.explosive
        rune.second_detanation = this.second_detanation

        let t = this.owner.getTarget()

        rune.setOwner(this.owner)

        if (t) {
            rune.setPoint(t.x, t.y)
        } else {
            rune.setPoint(hit_x, hit_y)
        }

        this.owner.level.binded_effects.push(rune)

        if (this.runefield) {
            let count = this.owner.getSecondResource()
            let zones = 6.28 / count

            this.cd = count * 500

            for (let i = 1; i <= count; i++) {
                await Func.sleep(300)
                let distance_x = Func.random(5, 9)
                let distance_y = Func.random(5, 9)

                let min_a = (i - 1) * zones
                let max_a = i * zones

                let angle = Math.random() * (max_a - min_a) + min_a

                let x = hit_x + Math.sin(angle) * distance_x
                let y = hit_y + Math.cos(angle) * distance_y

                let rune = new RuneEffect(this.owner.level)
                rune.fast_detonation = this.fast_detonation
                rune.explosive = this.explosive
                rune.second_detanation = this.second_detanation

                rune.setOwner(this.owner)
                rune.setPoint(x, y)

                this.owner.level.binded_effects.push(rune)
            }
        }
        else{
            this.cd = 0
        }

        this.afterUse()
    }
}
