import GoldNovaAbility from '../../EnemyAbilities/GoldNovaAbility'
import Func from '../../Func'
import Level from '../../Level'
import GoldStatue from '../src/Enemy/GoldStatue'
import Unit from '../src/Unit'
import Effect from './Effects'
import UltimatumArena from './UltimatumArena'

export default class UltimatumText4 extends Effect {
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
        this.name = 'ultimatum4'
        this.box_r = 2.2
    }

    activate() {
        this.level.addMessedge('destroy gold statue.')
        this.level.addSound('challenge start', this.x, this.y)

        this.activated = true
        this.timer = this.level.time

        this.effect = new UltimatumArena(this.level)
        this.effect.setPoint(this.x, this.y)

        this.level.binded_effects.push(this.effect)

        let statue = new GoldStatue(this.level)

        while (statue.isOutOfMap()) {
            let angle = Math.random() * 6.28

            let distance_x = Func.random(6, 12)
            let distance_y = Func.random(6, 12)

            statue.x = this.x + Math.sin(angle) * distance_x
            statue.y = this.y + Math.cos(angle) * distance_y
        }

        this.monster = statue
        this.level.enemies.push(this.monster)
    }

    success() {
        this.level.addSound('gold spending', this.x, this.y)
        this.level.addMessedge('gold was added.')

        this.level.players.forEach(elem => {
            elem.gold += 50
        })

        if (this.effect) {
            this.effect.delete()
        }

        this.delete()
    }

    fail() {
        this.level.addSound('challenge failed', this.x, this.y)
        this.level.addMessedge('angry gold.')

        if (this.monster && !this.monster.is_dead) {
            this.monster.life_status = 20
            this.monster.abilities.push(new GoldNovaAbility())
        }

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
