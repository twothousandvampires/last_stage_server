import Func from '../Func'
import Level from '../Level'
import Bones from '../Objects/src/Enemy/Bones'
import { Flamy } from '../Objects/src/Enemy/Flamy'
import Impy from '../Objects/src/Enemy/Impy'
import Cultist from '../Objects/src/PlayerClasses/Cultist'
import Flyer from '../Objects/src/PlayerClasses/Flyer'
import Swordman from '../Objects/src/PlayerClasses/Swordman'
import Scenario from './Scenario'

export default class BonesAttack extends Scenario {
    map: any
    targets: any
    constructor() {
        super()
        this.targets = []
        this.map = [
            {
                time: 1200,
                action: (level: Level) => {
                    this.targets.forEach(elem => {
                        elem.takeDamage(undefined, {
                            explode: true,
                        })
                    })
                },
            },
            {
                time: 2500,
                action: (level: Level) => {
                    this.targets.forEach(elem => {
                        let s = new Bones(level)
                        s.spawn_time = 600
                        s.setPoint(elem.x, elem.y)
                        s.target = level.players[0]
                        level.enemies.push(s)
                    })
                },
            },
        ]
    }

    start(level: Level) {
        let variants = [
            new Swordman(level),
            new Flyer(level),
            new Cultist(level),
            new Impy(level),
            new Cultist(level),
            new Impy(level),
            new Swordman(level),
            new Flamy(level),
            new Swordman(level),
            new Flyer(level),
        ]
        level.players.forEach(elem => {
            elem.x = 40
            elem.y = 60
            elem.light_r = 20
        })

        let p = level.players[0]
        let x = p.x
        let y = p.y
        let distance_x = Func.random(8, 16)
        let distance_y = Func.random(8, 16)
        let count = 9

        let zones = 6.28 / count

        for (let i = 1; i <= count; i++) {
            let min_a = (i - 1) * zones

            let angle = min_a
            let e = variants[i]
            e.x = x + Math.sin(angle) * distance_x
            e.y = y + Math.cos(angle) * distance_y
            e.idleAct = () => {}
            e.life_status = 1
            e.armour_rate = 0
            this.targets.push(e)
            level.enemies.push(e)
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
