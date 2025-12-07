import Func from '../Func'
import Level from '../Level'
import { FlameWallObject } from '../Objects/Projectiles/FlameWallObject'
import Solid from '../Objects/src/Enemy/Solid'

import CurseOfDamned from '../Status/CurseOfDamned'
import Scenario from './Scenario'

export default class Penta extends Scenario {
    map: any
    targets: any
    constructor() {
        super()
        this.targets = []
        this.map = [
            {
                time: 2400,
                action: (level: Level) => {
                    this.draw(level)
                },
            },
            {
                time: 5100,
                action: (level: Level) => {
                    level.players[0].life_status = 1
                    level.players[0].armour_rate = 1
                    level.players[0].takeDamage(undefined, {
                        explode: true,
                    })

                    let solid = new Solid(level)
                    solid.setIdleAct()
                    solid.getStateTimer = undefined
                    solid.is_spawning = false
                    solid.setPoint(level.players[0].x, level.players[0].y)
                    setTimeout(() => {
                        level.enemies.push(solid)
                    }, 300)
                },
            },
        ]
    }

    async draw(level: Level) {
        let center_x = 60
        let center_y = 60
        let dis = 6
        let d = 10
        let dd = 40

        let draw_start_y = center_y + (d * dis) / 2
        let draw_start_x = center_x

        let a = 3.14 - 0.31

        // line 1
        for (let i = 0; i < 10; i++) {
            await Func.sleep(dd)
            let flame = new FlameWallObject(level, 1111, 2222222)

            flame.setPoint(
                draw_start_x + Math.sin(a) * (i * dis),
                draw_start_y + Math.cos(a) * (i * dis)
            )

            level.projectiles.push(flame)

            if (i === 9) {
                draw_start_x = draw_start_x + Math.sin(a) * (i * dis)
                draw_start_y = draw_start_y + Math.cos(a) * (i * dis)
            }
        }

        a = a + 3.14 - 0.63

        for (let i = 0; i < 10; i++) {
            await Func.sleep(dd)
            let flame = new FlameWallObject(level, 1111, 12222)

            flame.setPoint(
                draw_start_x + Math.sin(a) * (i * dis),
                draw_start_y + Math.cos(a) * (i * dis)
            )

            level.projectiles.push(flame)

            if (i === 9) {
                draw_start_x = draw_start_x + Math.sin(a) * (i * dis)
                draw_start_y = draw_start_y + Math.cos(a) * (i * dis)
            }
        }

        a = a - 3.14 - 0.63

        for (let i = 0; i < 10; i++) {
            await Func.sleep(dd)
            let flame = new FlameWallObject(level, 1111, 12222)

            flame.setPoint(
                draw_start_x + Math.sin(a) * (i * dis),
                draw_start_y + Math.cos(a) * (i * dis)
            )

            level.projectiles.push(flame)

            if (i === 9) {
                draw_start_x = draw_start_x + Math.sin(a) * (i * dis)
                draw_start_y = draw_start_y + Math.cos(a) * (i * dis)
            }
        }

        a = a + 3.14 - 0.63
        for (let i = 0; i < 10; i++) {
            await Func.sleep(dd)
            let flame = new FlameWallObject(level, 1111, 12222)

            flame.setPoint(
                draw_start_x + Math.sin(a) * (i * dis),
                draw_start_y + Math.cos(a) * (i * dis)
            )

            level.projectiles.push(flame)

            if (i === 9) {
                draw_start_x = draw_start_x + Math.sin(a) * (i * dis)
                draw_start_y = draw_start_y + Math.cos(a) * (i * dis)
            }
        }

        a = a - 3.14 - 0.63
        for (let i = 0; i < 10; i++) {
            await Func.sleep(dd)
            let flame = new FlameWallObject(level, 1111, 12222)

            flame.setPoint(
                draw_start_x + Math.sin(a) * (i * dis),
                draw_start_y + Math.cos(a) * (i * dis)
            )

            level.projectiles.push(flame)

            if (i === 9) {
                draw_start_x = draw_start_x + Math.sin(a) * (i * dis)
                draw_start_y = draw_start_y + Math.cos(a) * (i * dis)
            }
        }
    }

    start(level: Level) {
        level.players.forEach(elem => {
            elem.x = 60
            elem.y = 60
            elem.light_r = 20
        })
        let status = new CurseOfDamned(level.time)
        status.setDuration(2000)
        level.setStatus(level.players[0], status)
    }

    checkTime(level: Level) {
        let time_elapsed = level.time - level.started

        let next_action = this.map[0]

        if (next_action && next_action.time <= time_elapsed) {
            next_action.action(level)
            this.map.shift()
        }
    }
}
