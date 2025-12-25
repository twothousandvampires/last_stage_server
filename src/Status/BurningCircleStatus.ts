import Func from '../Func'
import BurningCircleEffect from '../Objects/Effects/BurningCircleEffect'
import FireExplosion from '../Objects/Effects/FireExplosion'
import Status from './Status'

export default class BurningCircleStatus extends Status {
    radius: number
    frequency: number
    devouring: boolean
    hatred: boolean
    x: any
    y: any
    effect: any

    constructor(public time: number) {
        super(time)
        this.radius = 12
        this.name = 'burning circle'
        this.frequency = 1000
        this.hatred = false
        this.devouring = false
    }

    clear() {
        this.unit.level.deleted.push(this.effect.id)
        this.unit.level.binded_effects = this.unit.level.binded_effects.filter(
            elem => elem != this.effect
        )
    }

    setRadius(radius: number) {
        this.radius = radius
    }

    setFrequency(frequency: number) {
        this.frequency = frequency
        if (this.frequency < 200) {
            this.frequency = 200
        }
    }

    apply(unit: any) {
        this.unit = unit

        let effect = new BurningCircleEffect(this.unit.level)
        effect.setOwner(this.unit)
        effect.setPoint(this.unit.x, this.unit.y)

        this.effect = effect

        unit.level.binded_effects.push(effect)
    }

    act(tick_time: number) {
        if (tick_time > this.last_checked) {
            this.last_checked += this.frequency

            let box = this.unit.getBoxElipse()
            box.r = this.radius

            this.unit.level.enemies.forEach(elem => {
                if (!elem.is_dead && Func.elipseCollision(box, elem.getBoxElipse())) {
                    elem.takeDamage(this.unit, {
                        burn: true,
                    })

                    if (this.hatred && elem.is_dead && Func.chance(30)) {
                        let effect = new FireExplosion(this.unit.level)
                        let hit = elem.getBoxElipse()
                        hit.r = 8

                        effect.setPoint(hit.x, hit.y)

                        this.unit.level.enemies.forEach(enemy => {
                            if (!enemy.is_dead && Func.elipseCollision(enemy.getBoxElipse(), hit)) {
                                enemy.takeDamage()
                            }
                        })

                        this.unit.level.players.forEach(player => {
                            if (
                                player != this.unit &&
                                !player.is_dead &&
                                Func.elipseCollision(player.getBoxElipse(), hit)
                            ) {
                                player.takeDamage()
                            }
                        })

                        this.unit.level.effects.push(effect)
                    }

                    if (this.devouring && elem.is_dead && Func.chance(20)) {
                        this.time += 200
                    }
                }
            })

            this.unit.level.players.forEach(elem => {
                if (elem != this.unit && Func.elipseCollision(box, elem.getBoxElipse())) {
                    elem.takeDamage(this.unit, {
                        burn: true,
                    })
                }
            })
        }
    }
}
