import Func from '../Func'
import ElementalEnchantedEffect from '../Objects/Effects/ElementalEnchantedEffect'
import FireExplosion from '../Objects/Effects/FireExplosion'
import FrostExplosionBig from '../Objects/Effects/FrostExplosionBig'
import { EnemyLightning } from '../Objects/Projectiles/EnemyLightning'
import Ignite from './Ignite'
import ShockStatus from './ShockStatus'
import Status from './Status'

export default class ElementalEnchanted extends Status {
    radius: number
    x: any
    y: any
    effect: any

    constructor(public time: number) {
        super(time)
        this.radius = 10
        this.name = 'elemental enchanted'
    }

    clear() {
        let r = Func.random(1, 3)

        if (r === 1) {
            let e = new FrostExplosionBig(this.unit.level)
            e.setPoint(this.unit.x, this.unit.y)

            this.unit.level.effects.push(e)

            let box = this.unit.getBoxElipse()
            box.r = 12

            this.unit.level.players.forEach(elem => {
                if (Func.elipseCollision(elem.getBoxElipse(), box)) {
                    elem.setFreeze(3000)
                }
            })

            this.unit.level.enemies.forEach(elem => {
                if (Func.elipseCollision(elem.getBoxElipse(), box)) {
                    elem.setFreeze(3000)
                }
            })
        } else if (r === 2) {
            let e = new FireExplosion(this.unit.level)
            e.setPoint(this.unit.x, this.unit.y)

            this.unit.level.effects.push(e)

            let box = this.unit.getBoxElipse()
            box.r = 12

            this.unit.level.players.forEach(elem => {
                if (Func.elipseCollision(elem.getBoxElipse(), box)) {
                    elem.takeDamage(undefined, {})
                }
            })

            this.unit.level.enemies.forEach(elem => {
                if (Func.elipseCollision(elem.getBoxElipse(), box)) {
                    elem.takeDamage(undefined, {})
                }
            })
        } else {
            let count = 8

            let zones = 6.28 / count

            for (let i = 1; i <= count; i++) {
                let min_a = (i - 1) * zones
                let max_a = i * zones

                let angle = Math.random() * (max_a - min_a) + min_a
                let proj = new EnemyLightning(this.unit.level)
                proj.setAngle(angle)
                proj.setPoint(this.unit.x, this.unit.y)

                this.unit.level.projectiles.push(proj)
            }
        }

        this.unit.level.deleted.push(this.effect.id)
        this.unit.level.binded_effects = this.unit.level.binded_effects.filter(
            elem => elem != this.effect
        )
    }

    apply(unit: any) {
        this.unit = unit
        unit.gold_revard += 1
        let effect = new ElementalEnchantedEffect(this.unit.level)
        effect.setOwner(this.unit)
        effect.setPoint(this.unit.x, this.unit.y)
        this.effect = effect

        unit.level.binded_effects.push(effect)
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += 1000

            this.unit.level.players.forEach(elem => {
                if (Func.chance(10) && Func.distance(elem, this.unit) <= this.radius) {
                    let r = Func.random(1, 3)
                    if (r === 1) {
                        elem.setFreeze(2000)
                    } else if (r === 2) {
                        let s = new ShockStatus(tick_time)
                        s.setPower(25)
                        s.setDuration(5000)

                        elem.level.setStatus(elem, s, true)
                    } else {
                        let s = new Ignite(tick_time)
                        s.setPower(25)
                        s.setDuration(5000)

                        elem.level.setStatus(elem, s, true)
                    }
                }
            })
        }
    }
}
