import Func from '../../Func'
import Level from '../../Level'
import Projectiles from './Projectiles'

export class ChainLightning extends Projectiles {
    w: number = 1
    check_rasius: number = 20
    hited: any = []
    chain_count: number = 15

    constructor(level: Level) {
        super(level)
        this.box_r = 0.5
        this.name = 'lightning'
        this.move_speed = 1.5
    }

    act(): void {
        let enemies = this.level.enemies
        let players = this.level.players

        for (let i = 0; i < players.length; i++) {
            let p = players[i]
            if (p === this.owner || this.w < p.z) continue

            if (
                !p.is_dead &&
                Func.elipseCollision(this.getBoxElipse(), p.getBoxElipse()) &&
                !this.hited.includes(p.id)
            ) {
                this.hited.push(p.id)
                p.takeDamage(this.owner)
                this.impact()
                return
            }
        }

        for (let i = 0; i < enemies.length; i++) {
            let e = enemies[i]
            if (
                !e.is_dead &&
                Func.elipseCollision(this.getBoxElipse(), e.getBoxElipse()) &&
                !this.hited.includes(e.id)
            ) {
                this.hited.push(e.id)
                e.takeDamage(this.owner)
                this.impact()
                return
            }
        }

        this.moveAct()
    }

    impact() {
        if (this.chain_count <= 0) {
            this.level.deleted.push(this.id)
            this.level.projectiles = this.level.projectiles.filter(elem => elem != this)

            return
        }
        let targets: any = []

        let radius = this.check_rasius

        this.level.players.forEach(p => {
            if (
                !p.is_dead &&
                Func.distance(this, p) <= radius &&
                p != this.owner &&
                !this.hited.includes(p.id)
            ) {
                targets.push(p)
            }
        })

        this.level.enemies.forEach(p => {
            if (!p.is_dead && Func.distance(this, p) <= radius && !this.hited.includes(p.id)) {
                targets.push(p)
            }
        })

        if (targets.length > 0) {
            let r = Func.getRandomFromArray(targets)
            this.angle = Func.angle(this.x, this.y, r.x, r.y)
            this.chain_count--
        } else {
            this.level.deleted.push(this.id)
            this.level.projectiles = this.level.projectiles.filter(elem => elem != this)
        }
    }
}
