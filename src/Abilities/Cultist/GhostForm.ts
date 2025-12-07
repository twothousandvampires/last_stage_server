import Func from '../../Func'
import IUnitState from '../../Interfaces/IUnitState'
import Character from '../../Objects/src/Character'
import Cultist from '../../Objects/src/PlayerClasses/Cultist'
import AfterlifeCold from '../../Status/AfterlifeCold'
import Weakness from '../../Status/Weakness'
import Ability from '../Ability'
import CultistAbility from './CultistAbility'

export default class GhostForm extends CultistAbility implements IUnitState<Character> {
    lead: boolean
    afterlife_cold: boolean
    start: number = 0
    base_ghost_time: number = 3000
    ghost_time: number = 0
    started: boolean = false

    constructor(owner: Cultist) {
        super(owner)

        this.lead = false
        this.afterlife_cold = false
        this.name = 'ghost form'
        this.cd = 15000
        this.type = Ability.TYPE_CUSTOM
        this.mastery_chance = 25
    }

    impact(): void {}

    enter(player: Character) {
        this.used = true

        player.action_time = 500
        player.can_be_damaged = false
        player.setImpactTime(100)
        player.phasing = true
        player.can_attack = false
        player.can_cast = false
        player.state = 'start ghost'
    }

    update(player: Character, time: number) {
        if (player.action && !this.started) {
            this.start = player.level.time
            this.started = true
            this.owner.state = 'ghost'
            this.ghost_time = this.base_ghost_time + player.getSecondResource() * 100

            if (this.afterlife_cold) {
                let status = new AfterlifeCold(time)
                status.setDuration(this.ghost_time)

                player.level.setStatus(this.owner, status)
            }

            this.afterUse()

            if (this.lead) {
                let r = this.owner.getBoxElipse()
                r.r = 15
                this.owner.level.players.forEach(elem => {
                    if (elem != this.owner && Func.elipseCollision(elem.getBoxElipse(), r)) {
                        elem.phasing = true
                        let status = new Weakness(time)
                        status.setDuration(this.ghost_time)

                        this.owner.level.setStatus(elem, status)

                        setTimeout(() => {
                            elem.phasing = false
                        }, this.ghost_time)
                    }
                })
            }
        } else if (this.started) {
            if (time - this.start >= this.ghost_time) {
                player.getState()
            }
        }
    }

    exit(player: Character) {
        this.started = false

        player.can_be_damaged = true
        player.phasing = false
        player.can_attack = true
        player.can_cast = true
    }
}
