import Func from '../Func'
import Level from '../Level'
import Bonfire from '../Objects/Effects/Bonfire'
import EnemyRemains from '../Objects/Effects/EnemyRemains'
import EnemyRemains2 from '../Objects/Effects/EnemyRemains2'
import FireExplosion from '../Objects/Effects/FireExplosion'
import FireExplosionSmall from '../Objects/Effects/FireExplosionSmall'
import ItemDrop from '../Objects/Effects/ItemDrop'
import NatureNoLight from '../Objects/Effects/NatureNoLight'
import NatureWithLight from '../Objects/Effects/NatureWithLight'
import SmallTextLanguage1 from '../Objects/Effects/SmallTextLanguage1'
import SmallTextLanguage2 from '../Objects/Effects/SmallTextLanguage2'
import TextLanguage1 from '../Objects/Effects/TextLanguage1'
import TextLanguage2 from '../Objects/Effects/TextLanguage2'
import Torch from '../Objects/Effects/Torch'
import { Spark } from '../Objects/Projectiles/Spark'
import FlyingBones from '../Objects/src/Enemy/FlyingBones'
import Cultist from '../Objects/src/PlayerClasses/Cultist'
import Flyer from '../Objects/src/PlayerClasses/Flyer'
import Swordman from '../Objects/src/PlayerClasses/Swordman'
import EnemyCastState from '../State/EnemyCastState'
import Scenario from './Scenario'

export default class Conversation extends Scenario {
    map: any
    targets: any
    swordman: any
    cultist: any
    flyer: any
    centr_x: number = 60
    centr_y: number = 60
    back: any
    bonfire: any
    bonfire_y: number = this.centr_x + 14
    dark1: any
    dark2: any
    start_time: number = 0

    constructor() {
        super()
        this.targets = []
        this.map = [
            {
                time: 2000,
                action: (level: Level) => {
                    let phrase = new SmallTextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.swordman.x, this.swordman.y)

                    level.effects.push(phrase)
                },
            },
            {
                time: 3600,
                action: (level: Level) => {
                    let phrase = new SmallTextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.swordman.x, this.swordman.y)

                    level.effects.push(phrase)
                },
            },
            {
                time: 5000,
                action: (level: Level) => {
                    let phrase = new TextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.swordman.x, this.swordman.y)

                    level.effects.push(phrase)
                },
            },
            {
                time: 10000,
                action: (level: Level) => {
                    let phrase = new SmallTextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.cultist.x, this.cultist.y)

                    level.effects.push(phrase)
                },
            },
            {
                time: 12000,
                action: (level: Level) => {
                    let phrase = new SmallTextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.swordman.x, this.swordman.y)

                    level.effects.push(phrase)
                },
            },
            {
                time: 15000,
                action: (level: Level) => {
                    let phrase = new SmallTextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.cultist.x, this.cultist.y)

                    level.effects.push(phrase)
                },
            },
            {
                time: 17000,
                action: (level: Level) => {
                    let phrase = new SmallTextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.cultist.x, this.cultist.y)

                    level.effects.push(phrase)
                },
            },
            {
                time: 18400,
                action: (level: Level) => {
                    let phrase = new TextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.cultist.x, this.cultist.y)

                    level.effects.push(phrase)
                },
            },
            {
                time: 22000,
                action: (level: Level) => {
                    let phrase = new SmallTextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.cultist.x, this.cultist.y)

                    level.effects.push(phrase)
                },
            },
            {
                time: 23500,
                action: (level: Level) => {
                    let phrase = new SmallTextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.swordman.x, this.swordman.y)

                    level.effects.push(phrase)
                },
            },
            {
                time: 25000,
                action: (level: Level) => {
                    let phrase = new SmallTextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.flyer.x, this.flyer.y)

                    level.effects.push(phrase)
                },
            },
            {
                time: 26400,
                action: (level: Level) => {
                    let phrase = new SmallTextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.cultist.x, this.cultist.y)

                    level.effects.push(phrase)
                },
            },
            {
                time: 28000,
                action: (level: Level) => {
                    let phrase = new SmallTextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.flyer.x, this.flyer.y)

                    level.effects.push(phrase)
                },
            },
            {
                time: 30000,
                action: (level: Level) => {
                    let phrase = new SmallTextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.flyer.x, this.flyer.y)

                    level.effects.push(phrase)

                    this.dark1 = new FlyingBones(level)
                    this.dark1.setPoint(this.centr_x - 8, this.centr_y - 22)
                    this.dark1.abilities = []
                    this.dark1.player_check_radius = 1000

                    this.dark1.life_status = 222
                    this.dark1.move_speed = 0
                    level.enemies.push(this.dark1)

                    this.dark2 = new FlyingBones(level)
                    this.dark2.setPoint(this.centr_x + 12, this.centr_y - 25)
                    this.dark2.abilities = []

                    this.dark2.life_status = 222
                    this.dark2.player_check_radius = 1000
                    this.dark2.move_speed = 0
                    level.enemies.push(this.dark2)
                },
            },
            {
                time: 31300,
                action: (level: Level) => {
                    let phrase = new TextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.flyer.x, this.flyer.y)

                    level.effects.push(phrase)
                },
            },
            {
                time: 35000,
                action: (level: Level) => {
                    this.dark1.move_speed = 0.32
                    this.dark1.target = level.players[0]
                    this.dark2.move_speed = 0.38
                    this.dark2.target = level.players[0]
                },
            },
            {
                time: 37000,
                action: (level: Level) => {
                    this.dark1.move_speed = 0
                    this.dark2.move_speed = 0

                    let phrase = new SmallTextLanguage2(level)
                    phrase.z = 12
                    phrase.setPoint(this.dark1.x, this.dark1.y)

                    level.effects.push(phrase)
                },
            },
            {
                time: 38000,
                action: (level: Level) => {
                    let phrase = new SmallTextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.swordman.x, this.swordman.y)

                    level.effects.push(phrase)
                },
            },
            {
                time: 38300,
                action: (level: Level) => {
                    this.dark1.setState(new EnemyCastState())
                    let phrase = new SmallTextLanguage2(level)
                    phrase.z = 12
                    phrase.setPoint(this.dark1.x, this.dark1.y)

                    level.effects.push(phrase)
                },
            },
            {
                time: 40800,
                action: (level: Level) => {
                    let count = 10 + 6
                    let zones = 6.28 / count

                    for (let i = 1; i <= count; i++) {
                        let min_a = (i - 1) * zones
                        let max_a = i * zones

                        let angle = Math.random() * (max_a - min_a) + min_a

                        let proj = new Spark(level, 4, 3000)

                        proj.setAngle(angle)
                        proj.setPoint(this.bonfire.x, this.bonfire.y)

                        level.projectiles.push(proj)
                    }
                },
            },
            {
                time: 41500,
                action: (level: Level) => {
                    this.swordman.setZap(10000)
                    this.cultist.setZap(10000)
                    this.flyer.setZap(10000)
                },
            },
            {
                time: 42500,
                action: (level: Level) => {
                    let phrase = new SmallTextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.cultist.x, this.cultist.y)

                    level.effects.push(phrase)
                },
            },
            {
                time: 43500,
                action: (level: Level) => {
                    this.dark2.setState(new EnemyCastState())
                    let phrase = new TextLanguage2(level)
                    phrase.z = 12
                    phrase.setPoint(this.dark2.x, this.dark2.y)

                    level.effects.push(phrase)
                },
            },
            {
                time: 44700,
                action: (level: Level) => {
                    let e = new FireExplosionSmall(level)
                    e.setPoint(this.bonfire.x, this.bonfire.y)
                    level.addEffect(e)

                    level.addSound('fire explosion', this.centr_x, this.centr_y)

                    this.bonfire.invisible = true
                    this.bonfire.wasChanged()
                    this.bonfire.disabled = true
                },
            },
            {
                time: 46000,
                action: (level: Level) => {
                    let phrase = new SmallTextLanguage1(level)
                    phrase.z = 12
                    phrase.setPoint(this.swordman.x, this.swordman.y)

                    level.effects.push(phrase)
                },
            },
            {
                time: 48000,
                action: (level: Level) => {
                    level.addSound('devil sound', this.centr_x, this.centr_y)

                    level.deleted.push(this.swordman.id)
                    level.deleted.push(this.flyer.id)
                    level.deleted.push(this.cultist.id)

                    level.binded_effects.forEach(elem => {
                        if (elem instanceof Bonfire) {
                        } else {
                            level.deleted.push(elem.id)
                        }
                    })
                },
            },
            {
                time: 51000,
                action: (level: Level) => {
                    this.bonfire.disabled = false
                    this.bonfire.invisible = false
                    this.bonfire.light_r = 19
                    this.bonfire.y += 12
                    this.bonfire.wasChanged()

                    let nature = new NatureWithLight(level)
                    nature.setPoint(this.centr_x, this.centr_y)
                    level.addEffect(nature)

                    this.swordman.invisible = true
                    this.flyer.invisible = true
                    this.cultist.invisible = true

                    this.dark1.invisible = true
                    this.dark2.invisible = true
                },
            },
        ]
    }

    start(level: Level) {
        level.players.forEach(elem => {
            elem.x = 60
            elem.y = 60
            elem.flipped = true
            elem.invisible = true
            elem.can_be_controlled_by_player = false
            elem.light_r = 0
        })

        this.centr_x = level.players[0].x
        this.centr_y = level.players[0].y

        let remains1 = new EnemyRemains(level)
        remains1.setPoint(this.centr_x - 8, this.centr_y - 6)
        level.binded_effects.push(remains1)

        let remains2 = new EnemyRemains2(level)
        remains2.setPoint(this.centr_x + 6, this.centr_y - 4)
        level.binded_effects.push(remains2)

        let remains3 = new EnemyRemains(level)
        remains3.setPoint(this.centr_x + 16, this.centr_y + 10)
        level.binded_effects.push(remains3)

        let remains4 = new EnemyRemains(level)
        remains4.setPoint(this.centr_x + 10, this.centr_y + 6)
        level.binded_effects.push(remains4)

        this.bonfire = new Bonfire(level)
        this.bonfire.setPoint(this.centr_x, this.centr_y)
        level.binded_effects.push(this.bonfire)

        let item = new ItemDrop(level)
        item.setPoint(this.centr_x + 11, this.centr_y + 4)
        item.act = () => {}

        level.binded_effects.push(item)

        let flyer = new Flyer(level)
        flyer.setPoint(this.centr_x - 5, this.centr_y - 5)
        level.players.push(flyer)
        this.flyer = flyer

        let swordman = new Swordman(level)
        swordman.flipped = true
        swordman.setPoint(this.centr_x + 4, this.centr_y - 4)
        level.players.push(swordman)
        this.swordman = swordman

        let cultist = new Cultist(level)
        cultist.setPoint(this.centr_x - 5, this.centr_y - 1)
        level.players.push(cultist)
        this.cultist = cultist

        this.map = this.map.filter(elem => elem.time >= this.start_time)
        this.map.forEach(elem => {
            elem.time -= this.start_time
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
