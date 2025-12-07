import Func from '../../Func'
import { SoulShatterProj } from '../../Objects/Projectiles/SoulShatterProj'
import Cultist from '../../Objects/src/PlayerClasses/Cultist'
import Ability from '../Ability'
import CultistAbility from './CultistAbility'

export default class SoulShatter extends CultistAbility {
    mark: boolean = false

    constructor(owner: Cultist) {
        super(owner)
        this.name = 'soul shatter'
        this.type = Ability.TYPE_ATTACK
        this.mastery_chance = 5
    }

    impact() {
        let enemies = this.owner.level.enemies

        let rel_distance = Math.sqrt(
            (this.owner.x - this.owner.c_x) ** 2 + (this.owner.y - this.owner.c_y) ** 2
        )

        let distance =
            rel_distance > this.owner.attack_radius ? this.owner.attack_radius : rel_distance

        let hit_x = this.owner.x + Math.sin(this.owner.attack_angle) * distance
        let hit_y = this.owner.y + Math.cos(this.owner.attack_angle) * distance

        let r = this.owner.getBoxElipse()
        r.r = this.owner.attack_point_radius
        r.x = hit_x
        r.y = hit_y

        this.owner.level.sounds.push({
            name: 'blow',
            x: this.owner.x,
            y: this.owner.y,
        })

        let targer = this.owner.getTarget()

        if (!targer) {
            let f = enemies.filter(elem => Func.elipseCollision(r, elem.getBoxElipse()))

            f.sort((a, b) => Func.distance(this.owner, a) - Func.distance(this.owner, b))

            targer = f[0]
        }

        if (targer) {
            if (Func.chance(75) || this.mark) {
                targer.takeDamage(this.owner, {
                    explode: true,
                })

                if (targer.is_dead || this.mark) {
                    let count = 3 + this.owner.getSecondResource()
                    let zones = 6.28 / count

                    for (let i = 1; i <= count; i++) {
                        let min_a = (i - 1) * zones
                        let max_a = i * zones

                        let angle = Math.random() * (max_a - min_a) + min_a

                        let proj = new SoulShatterProj(this.owner.level)
                        proj.setStart(this.owner.level.time)
                        proj.setAngle(angle)
                        proj.setPoint(targer.x, targer.y)
                        proj.setOwner(this.owner)

                        this.owner.level.projectiles.push(proj)
                    }
                }
            } else {
                targer.takeDamage(this.owner)
            }
        }

        this.afterUse()
    }
}
