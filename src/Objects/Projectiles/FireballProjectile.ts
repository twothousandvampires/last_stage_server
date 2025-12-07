import Func from '../../Func'
import Level from '../../Level'
import FireExplosion from '../Effects/FireExplosion'
import FireExplosionMedium from '../Effects/FireExplosionMedium'
import FireExplosionSmall from '../Effects/FireExplosionSmall'
import Flyer from '../src/PlayerClasses/Flyer'
import { FlameWallObject } from './FlameWallObject'
import Projectiles from './Projectiles'

export class FireballProjectile extends Projectiles {
    size: number
    start_x: number | undefined
    start_y: number | undefined
    traveled: number
    max_distance: number
    medium_distance: number
    min_distance: number
    w: number
    hitted: any[]
    ignite: boolean

    constructor(
        level: Level,
        public pierce: boolean = false
    ) {
        super(level)
        this.box_r = 1
        this.name = 'fireball'
        this.move_speed = 0.3
        this.size = 3
        this.traveled = 0
        this.max_distance = 35
        this.medium_distance = 20
        this.min_distance = 10
        this.w = 3
        this.hitted = []
        this.ignite = false
    }

    setPoint(x: number = 0, y: number = 0): void {
        this.start_x = x
        this.start_y = y
        this.x = x
        this.y = y
    }

    act(): void {
        let enemies = this.level.enemies
        let players = this.level.players

        for (let i = 0; i < players.length; i++) {
            let p = players[i]
            if (p === this.owner || p.z > this.w) continue

            if (
                Func.elipseCollision(this.getBoxElipse(), p.getBoxElipse()) &&
                !this.hitted.includes(p.id)
            ) {
                this.hitted.push(p.id)
                this.impact()
                return
            }
        }

        for (let i = 0; i < enemies.length; i++) {
            let e = enemies[i]
            if (
                Func.elipseCollision(this.getBoxElipse(), e.getBoxElipse()) &&
                !this.hitted.includes(e.id)
            ) {
                this.hitted.push(e.id)
                this.impact()
                return
            }
        }

        this.traveled = Math.sqrt((this.x - this.start_x) ** 2 + (this.y - this.start_y) ** 2)

        if (this.traveled >= this.max_distance) {
            this.level.projectiles = this.level.projectiles.filter(elem => elem != this)
            this.level.deleted.push(this.id)
            return
        } else if (this.traveled > this.medium_distance && this.size === 2) {
            this.size = 1
            this.name = 'small fireball'
            this.move_speed = 0.15
        } else if (this.traveled > this.min_distance && this.size === 3) {
            this.size = 2
            this.name = 'medium fireball'
            this.move_speed = 0.2
        }

        this.moveAct()
    }

    impact() {
        let add_radius = 0

        if (this.owner instanceof Flyer) {
            add_radius += this.owner.getAdditionalRadius()
        }

        let effect = undefined
        let explosion_radius = 0

        this.level.addSound('fire explosion', this.x, this.y)

        if (this.size === 3) {
            effect = new FireExplosion(this.level)
            explosion_radius = 6 + add_radius
        } else if (this.size === 2) {
            effect = new FireExplosionMedium(this.level)
            explosion_radius = 4 + add_radius
        } else {
            effect = new FireExplosionSmall(this.level)
            explosion_radius = 2 + add_radius
        }

        if (this.ignite) {
            explosion_radius = 1
        }

        effect.setPoint(this.x, this.y)
        this.level.effects.push(effect)

        let explosion = this.getBoxElipse()
        explosion.r = explosion_radius

        this.level.players.forEach(p => {
            if (p != this.owner && Func.elipseCollision(explosion, p.getBoxElipse())) {
                p.takeDamage(this.owner, {
                    burn: true,
                })
            }
        })
        this.level.enemies.forEach(p => {
            if (Func.elipseCollision(explosion, p.getBoxElipse())) {
                p.takeDamage(this.owner, {
                    burn: true,
                })
            }
        })

        if (this.ignite) {
            let fire = new FlameWallObject(this.level)
            fire.setPoint(this.x, this.y)

            this.level.projectiles.push(fire)
        }

        if (this.pierce && Func.chance(50)) {
        } else {
            this.level.deleted.push(this.id)
            this.level.projectiles = this.level.projectiles.filter(elem => elem != this)
        }
    }
}
