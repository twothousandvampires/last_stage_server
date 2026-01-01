import Func from '../../Func'
import Level from '../../Level'
import Unit from '../src/Unit'
import Projectiles from './Projectiles'

export class FlameWallObject extends Projectiles {
    interval: any
    hitted: any
    w: number
    frendly_flame: boolean

    constructor(
        level: Level,
        public burn_time: number = 1000,
        public duration = 3000
    ) {
        super(level)
        this.box_r = 3
        this.name = 'flame'
        this.move_speed = 0
        this.interval = undefined
        this.hitted = []
        this.light_r = 6
        this.w = 8
        this.frendly_flame = false
        this.start()
    }

    setOwner(owner: Unit) {
        this.owner = owner
    }

    start() {
        setTimeout(() => {
            clearInterval(this.interval)
            this.level.deleted.push(this.id)
            this.level.projectiles = this.level.projectiles.filter(elem => elem != this)
        }, this.duration)

        this.interval = setInterval(() => {
            this.hitted = []
        }, this.burn_time)
    }
    act(): void {
        let enemies = this.level.enemies
        let players = this.level.players

        if (!this.frendly_flame) {
            for (let i = 0; i < players.length; i++) {
                let p = players[i]

                if (
                    p.z < this.w &&
                    !this.hitted.includes(p.id) &&
                    Func.elipseCollision(this.getBoxElipse(), p.getBoxElipse())
                ) {
                    p.takeDamage(undefined, {
                        burn: true,
                    })
                    this.hitted.push(p.id)
                }
            }
        }

        for (let i = 0; i < enemies.length; i++) {
            let e = enemies[i]
            if (
                !this.hitted.includes(e.id) &&
                Func.elipseCollision(this.getBoxElipse(), e.getBoxElipse())
            ) {
                e.takePureDamage(this.owner, {
                    burn: true,
                })
                this.hitted.push(e.id)
            }
        }
    }

    impact() {}
}
