import Func from '../Func'
import Character from '../Objects/src/Character'
import Player from '../Objects/src/Character'
import PlayerAttackState from '../State/PlayerAttackState'
import PlayerCastState from '../State/PlayerCastState'

export default abstract class Ability {
    static TYPE_CAST: number = 1
    static TYPE_ATTACK: number = 2
    static TYPE_INSTANT: number = 3
    static TYPE_CUSTOM: number = 4

    name: string | undefined
    used: boolean = false
    cd: number = 0
    cost: number = 0
    free: boolean = false
    need_to_pay: boolean = false
    type: number = Ability.TYPE_CAST
    state_sprite: string | undefined
    mastery_chance: number = 10

    after_use_triggers: any[] = []
    before_use_triggers: any[] = []

    constructor(public owner: Player) {}

    abstract impact(): void

    getMasteryChance() {
        return Func.chance(this.mastery_chance)
    }

    use(player: Character) {
        if (this.type === Ability.TYPE_CAST) {
            player.setState(new PlayerCastState())
        } else if (this.type === Ability.TYPE_ATTACK) {
            player.setState(new PlayerAttackState())
        } else if (this.type === Ability.TYPE_INSTANT) {
            this.impact()
            this.afterUse()
        } else if (this.type === Ability.TYPE_CUSTOM) {
            player.setState(this)
        }

        if (this.state_sprite) {
            player.state = this.state_sprite
        }
    }

    isEnergyEnough() {
        return this.owner.resource >= this.cost
    }

    canUse() {
        if (this.used) return false

        return this.owner.free_cast || (this.isEnergyEnough() && !this.owner.is_attacking)
    }

    getCd() {
        let red = this.owner.getCdRedaction()

        if (red > 95) {
            red = 95
        }

        return this.getCdValue() * (1 - red / 100)
    }

    getCdValue() {
        return this.cd
    }

    afterUse() {
        this.after_use_triggers.forEach((elem, index) => {
            let chance = this.mastery_chance
            let reduce = 1 + index
            chance = Math.round(chance / reduce)

            if (Func.chance(chance)) {
                elem.trigger(this.owner, this)
            }
        })

        if (this.need_to_pay) {
            this.owner.payCost()
        }

        this.owner.succefullCast()

        if (this.cd === 0) return

        this.used = true

        let cd = this.getCd()

        setTimeout(() => {
            this.used = false
        }, cd)
    }
}
