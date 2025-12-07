import Level from '../Level'
import FlyingBones from '../Objects/src/Enemy/FlyingBones'
import PileOfDead from '../Objects/src/Piles/PileOfDead'
import Scenario from './Scenario'

export default class DeadByPiles extends Scenario {
    map: any

    constructor() {
        super()
        this.map = [
            {
                time: 1200,
                action: (level: Level) => {
                    level.players.forEach(elem => {
                        elem.move_speed = 0.15
                        elem.pressed['d'] = true
                        elem.setLastInputs = () => {}
                    })
                },
            },
            {
                time: 3200,
                action: (level: Level) => {
                    level.players.forEach(elem => {
                        elem.move_speed = 0
                        elem.pressed['d'] = false
                    })
                },
            },
            {
                time: 3300,
                action: (level: Level) => {
                    let p = level.players[0]
                    let wizard = new FlyingBones(level)
                    wizard.flipped = true
                    wizard.spawn_time = 600
                    wizard.setPoint(p.x + 14, p.y)
                    wizard.attackAct = () => {}
                    level.enemies.push(wizard)
                },
            },
            {
                time: 6500,
                action: (level: Level) => {
                    level.players.forEach(elem => {
                        elem.armour_rate = 0
                        elem.life_status = 1
                    })
                    let p = level.players[0]
                    let x = p.x
                    let y = p.y
                    let distance = 10
                    let count = 10

                    let zones = 6.28 / count

                    for (let i = 1; i <= count; i++) {
                        let min_a = (i - 1) * zones
                        let max_a = i * zones

                        let angle = min_a
                        let e = new PileOfDead(level)
                        e.x = x + Math.sin(angle) * distance
                        e.y = y + Math.cos(angle) * distance
                        e.cast_time = 1000

                        level.enemies.push(e)
                    }
                },
            },
        ]
    }
    start(level: Level) {
        for (let i = 0; i < level.players.length; i++) {
            let p = level.players[i]
            p.light_r = 18
            if (i === 0) {
                p.x = 60
                p.y = 60
            } else if (i === 1) {
                p.x = 55
                p.y = 65
            } else {
                p.x = 57
                p.y = 55
            }
        }
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
