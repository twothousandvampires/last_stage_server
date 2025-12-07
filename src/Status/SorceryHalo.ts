import EnemyBuilder from '../Classes/EnemyBuilder'
import SorceryHaloEffect from '../Objects/Effects/SorceryHaloEffect'
import Enemy from '../Objects/src/Enemy/Enemy'
import Status from './Status'

export default class SorceryHalo extends Status {
    radius: number
    x: any
    y: any
    effect: any

    constructor(public time: number) {
        super(time)
        this.radius = 10
        this.name = 'sorcery halo'
    }

    clear() {
        if (this.effect) {
            this.effect.delete()
        }
    }

    isExpired(tick_time: number) {
        return !this.unit || this.unit.is_dead
    }

    apply(unit: any) {
        this.unit = unit
        unit.gold_revard += 2
        unit.life_status += 1
        unit.cooldown_attack -= 1000
        if (unit.cooldown_attack < 0) {
            unit.cooldown_attack = 0
        }

        if (this.unit instanceof Enemy) {
            for (let i = 0; i < 2; i++) {
                let ability = EnemyBuilder.getRanromEnemyAbility()
                this.unit.abilities.push(ability)
            }
        }

        let effect = new SorceryHaloEffect(this.unit.level)
        effect.setOwner(this.unit)
        effect.setPoint(this.unit.x, this.unit.y)
        this.effect = effect

        unit.level.binded_effects.push(effect)
    }
}
