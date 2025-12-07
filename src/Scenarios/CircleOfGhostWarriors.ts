import Level from '../Level'
import LightningBoltEffect from '../Objects/Effects/LightningBoltEffect'
import ToothExplode from '../Objects/Effects/ToothExplode'
import Specter from '../Objects/src/Enemy/Specter'
import Scenario from './Scenario'

export default class CircleOfGhostWarriors extends Scenario {
    map: any
    targets: any
    constructor() {
        super()
        this.targets = []
        this.map = [
            {
                time: 1000,
                action: (level: Level) => {
                    let p = level.players[0]
                    let count = 7
                    let zones = 6.28 / count
                    let distance = 12

                    for (let i = 1; i <= count; i++) {
                        let min_a = (i - 1) * zones

                        let angle = min_a
                        let e = new Specter(level)
                        e.x = p.x + Math.sin(angle) * distance
                        e.y = p.y + Math.cos(angle) * distance
                        e.getStateTimer = undefined
                        level.enemies.push(e)
                    }
                },
            },
            {
                time: 2600,
                action: (level: Level) => {
                    level.enemies.forEach(elem => {
                        elem.castAct = () => {}
                        elem.setCastState()
                    })
                },
            },
            {
                time: 3800,
                action: (level: Level) => {
                    level.enemies.forEach(elem => {
                        let x = elem.x
                        let y = elem.y
                        let distance = 5
                        let count = 5

                        let zones = 6.28 / count

                        for (let i = 1; i <= count; i++) {
                            let min_a = (i - 1) * zones
                            let max_a = i * zones

                            let angle = min_a
                            let e = new ToothExplode(level)
                            e.x = x + Math.sin(angle) * distance
                            e.y = y + Math.cos(angle) * distance

                            level.effects.push(e)
                        }
                        this.targets.push(elem)
                        level.deleted.push(elem.id)
                    })

                    level.enemies = []
                },
            },
            {
                time: 4500,
                action: (level: Level) => {
                    this.targets.forEach(elem => {
                        let x = elem.x
                        let y = elem.y

                        let e = new LightningBoltEffect(level)
                        e.x = x
                        e.y = y

                        level.effects.push(e)

                        let p = level.players[0]
                        p.setZap(10000)
                    })
                },
            },
        ]
    }

    createGhost(level: Level) {
        let player = level.players[0]

        let ghost = new Specter(level)
        ghost.x = player.x
        ghost.y = player.y + 5

        let ghost2 = new Specter(level)
        ghost2.x = player.x
        ghost2.y = player.y - 5

        ghost.idleAct = () => {}
        ghost2.idleAct = () => {}
        level.enemies.push(ghost)
        level.enemies.push(ghost2)

        setTimeout(() => {
            ghost.castAct = () => {}
            ghost.setCastState()

            ghost2.castAct = () => {}
            ghost2.setCastState()

            setTimeout(() => {
                let x = ghost.x
                let y = ghost.y
                let distance = 5
                let count = 5

                let zones = 6.28 / count

                for (let i = 1; i <= count; i++) {
                    let min_a = (i - 1) * zones
                    let max_a = i * zones

                    let angle = min_a
                    let e = new ToothExplode(level)
                    e.x = x + Math.sin(angle) * distance
                    e.y = y + Math.cos(angle) * distance

                    level.effects.push(e)
                }

                level.deleted.push(ghost.id)
                level.enemies = level.enemies.filter(elem => elem.id != ghost.id)

                let x2 = ghost2.x
                let y2 = ghost2.y

                for (let i = 1; i <= count; i++) {
                    let min_a = (i - 1) * zones
                    let max_a = i * zones

                    let angle = min_a
                    let e = new ToothExplode(level)
                    e.x = x2 + Math.sin(angle) * distance
                    e.y = y2 + Math.cos(angle) * distance

                    level.effects.push(e)
                }

                level.deleted.push(ghost.id)
                level.enemies = level.enemies.filter(elem => elem.id != ghost.id)

                level.deleted.push(ghost2.id)
                level.enemies = level.enemies.filter(elem => elem.id != ghost2.id)
            }, 1400)
        }, 1800)
    }

    start(level: Level) {
        level.players.forEach(elem => {
            elem.x = 60
            elem.y = 60
            elem.light_r = 20
            elem.can_be_controlled_by_player = true
        })
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
