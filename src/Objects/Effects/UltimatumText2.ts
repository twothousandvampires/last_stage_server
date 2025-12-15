import Func from '../../Func'
import IUltimatumChallenge from '../../Interfaces/IUltimatumChallenge'
import Level from '../../Level'
import Default from '../../Scenarios/Default'
import Effect from './Effects'
import Heal from './Heal'
import UltimatumArena from './UltimatumArena'

export default class UltimatumText2 extends Effect implements IUltimatumChallenge {
    timer = Date.now()

    activated: boolean = false
    activated_players = []
    failed = false
    challenge_radius = 25
    effect: any
    pool: (string | number)[] = []
    kill_trashold: number = 10

    constructor(level: Level) {
        super(level)
        this.name = 'ultimatum2'
        this.box_r = 2.2
    }

    success() {
        this.level.addSound('challenge done', this.x, this.y)
        this.level.addMessedge('good times has come.')

        let script = this.level.script

        if (script instanceof Default) {
            script.setTimes(Default.TIMES_GOOD)
        }

        if (this.effect) {
            this.effect.delete()
        }

        this.delete()
    }

    fail() {
        this.level.addSound('challenge failed', this.x, this.y)
        this.level.addMessedge('bad times has come.')

        let script = this.level.script
        if (script instanceof Default) {
            script.setTimes(Default.TIMES_BAD)
        }

        if (this.effect) {
            this.effect.delete()
        }

        this.delete()
    }

    activate() {
        this.level.addMessedge('kill enough enemies.')
        this.level.addSound('challenge start', this.x, this.y)

        this.activated = true
        this.timer = this.level.time

        this.effect = new UltimatumArena(this.level)
        this.effect.setPoint(this.x, this.y)

        this.level.binded_effects.push(this.effect)
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
                    this.activated_players.push(elem.id)
                    if (this.activated_players.length === this.level.players.length) {
                        this.activate()
                    }
                }
            })
        } else {
            this.level.players.forEach(elem => {
                if (Func.distance(this, elem) > this.challenge_radius) {
                    this.fail()
                }
            })
            this.level.enemies.forEach(elem => {
                if (
                    elem.is_dead &&
                    !this.pool.includes(elem.id) &&
                    Func.distance(elem, this) <= this.challenge_radius
                ) {
                    this.pool.push(elem.id)
                    if (this.pool.length >= this.kill_trashold) {
                        this.success()
                    } else {
                        let e = new Heal(this.level)
                        e.setPoint(elem.x, elem.y)

                        this.level.addEffect(e)
                    }
                }
            })
        }
    }
}
