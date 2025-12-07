import Func from '../../Func'
import Level from '../../Level'
import Default from '../../Scenarios/Default'
import FlyingBones from '../src/Enemy/FlyingBones'
import Solid from '../src/Enemy/Solid'
import Specter from '../src/Enemy/Specter'
import Unit from '../src/Unit'
import Effect from './Effects'
import UltimatumArena from './UltimatumArena'

export default class UltimatumText3 extends Effect {
    timer = Date.now()
    monster: Unit | undefined = undefined

    activated: boolean = false
    activated_players = []
    failed = false
    challenge_radius = 25
    effect: any

    constructor(
        level: Level,
        public start_power: number = 0
    ) {
        super(level)
        this.name = 'ultimatum3'
        this.box_r = 2.2
    }

    activate() {
        this.level.addMessedge('kill the beast.')
        this.level.addSound('challenge start', this.x, this.y)

        this.activated = true
        this.timer = this.level.time

        this.effect = new UltimatumArena(this.level)
        this.effect.setPoint(this.x, this.y)

        this.level.binded_effects.push(this.effect)

        let r = Func.random(1, 3)
        let e = undefined

        if (r === 1) {
            e = new Solid(this.level)
        } else if (r === 2) {
            e = new FlyingBones(this.level)
        } else {
            e = new Specter(this.level)
        }

        e.setPoint(this.x, this.y)
        this.monster = e

        if (this.level.script instanceof Default) {
            for (let i = 0; i < 3; i++) {
                e = this.level.script.createElite(e, this.level)
            }

            e = this.level.script.upgradeEnemy(e)
        }

        e.life_status += 5
        this.level.enemies.push(e)
    }

    success() {
        this.level.addSound('challenge done', this.x, this.y)
        this.level.addMessedge('you become stronger.')

        this.level.players.forEach(elem => {
            elem.armour_rate += 5
            elem.pierce += 5
        })

        if (this.effect) {
            this.effect.delete()
        }

        this.delete()
    }

    fail() {
        this.level.addSound('challenge failed', this.x, this.y)
        this.level.addMessedge('you are weaker now.')

        this.level.players.forEach(elem => {
            elem.armour_rate -= 5
            elem.pierce -= 5
        })

        if (this.effect) {
            this.effect.delete()
        }
        this.delete()
    }

    act(time: number) {
        if (time - this.timer >= 20000) {
            if (this.activated) {
                this.fail()
            } else {
                this.delete()
            }
        } else if (!this.activated) {
            this.level.players.forEach(elem => {
                if (
                    !this.activated_players.includes(elem.id) &&
                    Func.elipseCollision(elem.getBoxElipse(), this.getBoxElipse())
                ) {
                    this.activated_players.length++
                    if (this.activated_players.length === this.level.players.length) {
                        this.activate()
                    }
                }
            })
        } else if (this.activated && (!this.monster || this.monster.is_dead)) {
            this.success()
        } else {
            this.level.players.forEach(elem => {
                if (Func.distance(this, elem) > this.challenge_radius) {
                    this.fail()
                }
            })
        }
    }
}
