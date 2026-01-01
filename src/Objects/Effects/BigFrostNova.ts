import Func from '../../Func'
import Level from '../../Level'
import { FrostSphereProjectile } from '../Projectiles/FrostSphereProjectile'
import FrostSpire from '../src/Piles/FrostSpire'
import Effect from './Effects'

export default class BigFrostNova extends Effect {
    r: number
    can_act: boolean
    stage: number
    hited: any
    w: number
    genesis: any
    spires: any

    constructor(level: Level) {
        super(level)
        this.name = 'big frostnova'
        this.r = 8
        this.can_act = true
        this.stage = 1
        this.hited = []
        this.w = 2
    }

    act() {
        if (this.stage > 3) {
            if (this.genesis) {
                let box = this.getBoxElipse()
                box.r = 30

                let in_radius = this.level.enemies.filter(elem => {
                    return !elem.is_dead && Func.elipseCollision(box, elem.getBoxElipse())
                })

                this.hited.forEach(elem => {
                    if (elem.is_dead) {
                        let p = new FrostSphereProjectile(this.level)
                        p.setPoint(elem.x, elem.y)
                        p.setOwner(this.owner)

                        let t = in_radius[Math.floor(Math.random() * in_radius.length)]

                        if (t) {
                            p.setAngle(Func.angle(elem.x, elem.y, t.x, t.y))
                        } else {
                            p.setAngle(Math.random() * 6.28)
                        }

                        this.level.projectiles.push(p)
                    }
                })
            }

            if (this.spires && this.owner) {
                let count = this.owner.getAdditionalRadius()
                let zones = 6.28 / count

                for (let i = 1; i <= count; i++) {
                    let min_a = (i - 1) * zones
                    let max_a = i * zones

                    let angle = Math.random() * (max_a - min_a) + min_a
                    let x = Func.random(8, 25) * Math.sin(angle)
                    let y = Func.random(8, 25) * Math.cos(angle)

                    let spire = new FrostSpire(this.level)

                    spire.setPoint(this.x + x, this.y + y)

                    this.level.enemies.push(spire)
                }
            }

            this.level.binded_effects = this.level.binded_effects.filter(e => e != this)
            this.level.deleted.push(this.id)
            return
        }

        if (!this.can_act) return

        this.can_act = false

        let enemies = this.level.enemies
        let players = this.level.players

        let targets = enemies.concat(players)
        let wave = this.getBoxElipse()
        wave.r = this.r * (this.stage + this.owner.getAdditionalRadius())

        let filtered = targets.filter(
            elem =>
                !elem.is_dead &&
                elem.z < this.w &&
                !this.hited.includes(elem) &&
                Func.elipseCollision(wave, elem.getBoxElipse()) &&
                elem != this.owner
        )

        filtered.forEach(elem => {
            if (
                !elem.is_dead &&
                elem.z < this.w &&
                !this.hited.includes(elem) &&
                Func.elipseCollision(wave, elem.getBoxElipse()) &&
                elem != this.owner
            ) {
                this.hited.push(elem)
                elem.setFreeze(4000)
                if (this.stage === 1) {
                    elem.takeDamage(this.owner)
                }
            }
        })

        setTimeout(() => {
            this.can_act = true
            this.stage++
        }, 200)
    }
}
