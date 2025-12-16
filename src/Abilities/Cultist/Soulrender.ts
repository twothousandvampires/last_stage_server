import Cultist from '../../Objects/src/PlayerClasses/Cultist'
import CultistAbility from './CultistAbility'
import Func from '../../Func'
import Soul from '../../Objects/Effects/Soul'
import { SoulShatterProj } from '../../Objects/Projectiles/SoulShatterProj'

export default class Soulrender extends CultistAbility {
    distance: number
    count: number = 0
    soul_fragments: boolean = false
    prolifiration: number = 0

    constructor(owner: Cultist) {
        super(owner)
        this.name = 'soulrender'
        this.distance = 25
        this.mastery_chance = 3
    }

    tear(t) {
        this.owner.cast_speed += this.count * 150
        this.count = 0

        t.takeDamage(this.owner, {
            instant_death: true,
            explode: true,
        })

        if (t.is_dead) {
            let count = 5

            if (this.soul_fragments) {
                count += 5
            }

            let zones = 6.28 / count

            for (let i = 1; i <= count; i++) {
                let min_a = (i - 1) * zones
                let max_a = i * zones

                let angle = Math.random() * (max_a - min_a) + min_a
                let proj = new SoulShatterProj(this.owner.level)
                proj.setStart(this.owner.level.time)
                proj.setAngle(angle)
                proj.setPoint(t.x, t.y)

                this.owner.level.projectiles.push(proj)
            }
        }

        if (Func.chance(this.prolifiration)) {
            let possible = this.owner.level.enemies.filter(
                elem => !elem.is_dead && elem != t && Func.distance(t, elem) <= 8
            )[0]

            if (possible) {
                this.tear(possible)
            }
        }
    }

    impact() {
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

        let t = this.owner.getTarget()

        if (!t) {
            let box = this.owner.getBoxElipse()
            box.x = hit_x
            box.y = hit_y
            box.r = 4

            t = this.owner.level.enemies.filter(elem =>
                Func.elipseCollision(box, elem.getBoxElipse())
            )[0]
        }

        if (t) {
            if (Func.notChance(20 * this.count)) {
                this.count++
                this.owner.cast_speed -= 150

                let e = new Soul(this.owner.level)
                e.setPoint(t.x, t.y)

                this.owner.level.effects.push(e)
            } else {
                this.tear(t)
            }
        }
        this.afterUse()
    }
}
