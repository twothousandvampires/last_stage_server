import Func from '../../Func'
import Level from '../../Level'
import { InfernoFlame } from '../Projectiles/InfernoFlame'
import Effect from './Effects'
import LightningBoltEffect from './LightningBoltEffect'
import RocksFromCeil from './RocksFromCeil'
import SmallShockNova from './SmallShockNova'

export default class Intervention extends Effect {
    time: number

    constructor(level: Level) {
        super(level)
        this.name = 'intervention'
        this.box_r = 2
        this.time = Date.now()
    }

    act(time: number) {
        if (time - this.time >= 10000) {
            this.delete()
            return
        }

        this.level.players.forEach(elem => {
            if (Func.elipseCollision(elem.getBoxElipse(), this.getBoxElipse())) {
                if (elem.grace > 0) {
                    elem.grace--
                } else {
                    elem.takePureDamage()
                }

                let r = Func.random(0, 2)

                if (r === 0) {
                    this.activate(elem)
                } else if (r === 1) {
                    this.activate2(elem)
                } else if (r === 2) {
                    this.activate3(elem)
                }

                this.level.deleted.push(this.id)
                this.level.binded_effects = this.level.binded_effects.filter(elem => elem != this)
            }
        })
    }

    activate3(player: any) {
        let enemies = this.level.enemies
        let players = this.level.players
        players = players.filter(elem => elem != player)
        let targets = enemies.concat(players)
        let hit = player.getBoxElipse()
        hit.r = 18

        targets.forEach(elem => {
            if (!elem.is_dead && Func.elipseCollision(hit, elem.getBoxElipse())) {
                elem.armour_rate = 0
                elem.life_status = 1
                elem.takeDamage(undefined, {
                    explode: true,
                })

                if (elem.is_dead) {
                    targets.forEach(elem2 => {
                        let hit = elem.getBoxElipse()
                        hit.r = 15

                        if (!elem.is_dead && Func.elipseCollision(hit, elem2.getBoxElipse())) {
                            elem2.armour_rate = 0
                            elem2.life_status = 1
                            elem2.takeDamage(undefined, {
                                explode: true,
                            })

                            if (elem2.is_dead) {
                                targets.forEach(elem3 => {
                                    let hit = elem2.getBoxElipse()
                                    hit.r = 15

                                    if (
                                        !elem3.is_dead &&
                                        Func.elipseCollision(hit, elem3.getBoxElipse())
                                    ) {
                                        elem3.armour_rate = 0
                                        elem3.life_status = 1
                                        elem3.takeDamage(undefined, {
                                            explode: true,
                                        })
                                    }

                                    let e = new SmallShockNova(this.level)
                                    e.setPoint(elem2.x, elem2.y)
                                    this.level.effects.push(e)
                                })

                                let e = new SmallShockNova(this.level)
                                e.setPoint(elem.x, elem.y)
                                this.level.effects.push(e)
                            }
                        }
                    })

                    let e = new SmallShockNova(this.level)
                    e.setPoint(elem.x, elem.y)
                    this.level.effects.push(e)
                }
            }
        })

        let e = new SmallShockNova(this.level)
        e.setPoint(player.x, player.y)
        this.level.effects.push(e)
    }

    async activate2(player: any) {
        for (let i = 0; i < 40; i++) {
            await Func.sleep(80)
            let flame = new InfernoFlame(this.level)
            flame.setAngle(0)
            flame.setPoint(player.x, player.y)
            flame.setOwner(player)

            this.level.projectiles.push(flame)
        }
    }

    async activate(player: any) {
        let enemies = this.level.enemies
        let players = this.level.players

        let targets = enemies.concat(players)

        for (let i = 0; i < 50; i++) {
            await Func.sleep(150)

            let add = Math.round(i / 2)
            let distance_x = Func.random(5, 10) + add
            let distance_y = Func.random(5, 10) + add
            let angle = Math.random() * 6.28

            let x = player.x + Math.sin(angle) * distance_x
            let y = player.y + Math.cos(angle) * distance_y

            let hiting_box = {
                x: x,
                y: y,
                r: 8,
            }

            for (let i = 0; i < targets.length; i++) {
                let elem = targets[i]
                if (Func.elipseCollision(hiting_box, elem.getBoxElipse())) {
                    elem.takeDamage(undefined, {
                        burn: true,
                    })
                    break
                }
            }

            let l_effect = new LightningBoltEffect(this.level)
            l_effect.setPoint(x, y)

            this.level.addSound('lightning bolt', x, y)
            this.level.effects.push(l_effect)

            setTimeout(() => {
                let r_effect = new RocksFromCeil(this.level)
                r_effect.setPoint(x, y)
                r_effect.setOwner(this)
                this.level.effects.push(r_effect)
            }, 400)
        }
    }
}
