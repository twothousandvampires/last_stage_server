import Func from '../../Func'
import Level from '../../Level'
import FrostExplosionBig from '../Effects/FrostExplosionBig'
import FrostExplosionMedium from '../Effects/FrostExplosionMedium'
import FrostExplosionSmall from '../Effects/FrostExplosionSmall'
import Flyer from '../src/PlayerClasses/Flyer'
import { Icicle } from './Icicle'
import Projectiles from './Projectiles'
import { Tooth } from './Tooth'

export class FrostSphereProjectile extends Projectiles {
    size: number
    start_x: number | undefined
    start_y: number | undefined
    traveled: number
    max_distance: number
    medium_distance: number
    min_distance: number
    w: number
    frost_rich: boolean
    reign_of_frost: boolean
    icicles_count: number = 0
    last_icicles_time: number = 0
    ice: boolean = false
    shattering: boolean = false

    constructor(level: Level) {
        super(level)
        this.box_r = 1
        this.name = 'big frost sphere'
        this.move_speed = 0.25
        this.size = 3
        this.traveled = 0
        this.max_distance = 35
        this.medium_distance = 20
        this.min_distance = 10
        this.w = 3
        this.frost_rich = false
        this.reign_of_frost = false
    }

    setPoint(x: number = 0, y: number = 0): void {
        this.start_x = x
        this.start_y = y
        this.x = x
        this.y = y
    }

    act(time: number): void {
        let enemies = this.level.enemies
        let players = this.level.players

        for (let i = 0; i < players.length; i++) {
            let p = players[i]
            if (p === this.owner || this.w < p.z) continue
            if (p.is_dead) continue

            if (Func.elipseCollision(this.getBoxElipse(), p.getBoxElipse())) {
                this.impact()
                return
            }
        }

        for (let i = 0; i < enemies.length; i++) {
            let e = enemies[i]
            if (!e.is_dead && Func.elipseCollision(this.getBoxElipse(), e.getBoxElipse())) {
                this.impact()
                return
            }
        }
        if (this.icicles_count > 0 && time - this.last_icicles_time > 500) {
            let proj = new Icicle(this.level)
            proj.setOwner(this.owner)
            proj.setAngle(Math.random() * 6.28)
            proj.setPoint(this.x, this.y)

            this.level.projectiles.push(proj)

            this.last_icicles_time = time
            this.icicles_count--
        }
        this.traveled = Math.sqrt((this.x - this.start_x) ** 2 + (this.y - this.start_y) ** 2)

        if (this.traveled >= this.max_distance) {
            this.level.projectiles = this.level.projectiles.filter(elem => elem != this)
            this.level.deleted.push(this.id)
            return
        } else if (this.traveled > this.medium_distance && this.size === 2) {
            this.size = 1
            this.name = 'small frost sphere'
        } else if (this.traveled > this.min_distance && this.size === 3) {
            this.size = 2
            this.name = 'medium frost sphere'
        }

        this.moveAct()
    }

    impact() {
        let effect = undefined
        let explosion_radius = 0
        let add_radius = 0

        if (this.owner instanceof Flyer) {
            add_radius = this.owner.getAdditionalRadius()
        }

        if (this.size === 3) {
            effect = new FrostExplosionBig(this.level)
            explosion_radius = 6 + add_radius
        } else if (this.size === 2) {
            effect = new FrostExplosionMedium(this.level)
            explosion_radius = 4 + add_radius
        } else {
            effect = new FrostExplosionSmall(this.level)
            explosion_radius = 2 + add_radius
        }

        if (this.frost_rich) {
            explosion_radius += 3
        }

        effect.setPoint(this.x, this.y)
        this.level.effects.push(effect)

        let explosion = this.getBoxElipse()
        explosion.r = explosion_radius

        let freeze_duration = 2000

        if (this.reign_of_frost) {
            freeze_duration += 1000
        }

        this.level.players.forEach(p => {
            if (Func.elipseCollision(explosion, p.getBoxElipse())) {
                if (p !== this.owner) {
                    p.setFreeze(freeze_duration)
                    if (p.freezed || this.ice) {
                        p.takeDamage(this.owner)
                    }
                }
            }
        })
        this.level.enemies.forEach(p => {
            if (Func.elipseCollision(explosion, p.getBoxElipse())) {
                if (p.freezed) {
                    p.setFreeze(freeze_duration)
                    p.takeDamage(this.owner, {
                        damage_value: this.shattering ? 2 : undefined,
                    })
                } else if (this.ice) {
                    p.setFreeze(freeze_duration)
                    p.takeDamage(this.owner)
                } else {
                    p.setFreeze(freeze_duration)
                }
            }
        })

        if (this.icicles_count > 0) {
            let count = this.icicles_count

            let zones = 6.28 / count

            for (let i = 1; i <= count; i++) {
                let min_a = (i - 1) * zones
                let max_a = i * zones

                let angle = Math.random() * (max_a - min_a) + min_a
                let proj = new Icicle(this.level)
                proj.setOwner(this.owner)
                proj.setAngle(angle)
                proj.setPoint(this.x, this.y)

                this.level.projectiles.push(proj)
            }
        }

        this.level.deleted.push(this.id)
        this.level.projectiles = this.level.projectiles.filter(elem => elem != this)
    }
}
