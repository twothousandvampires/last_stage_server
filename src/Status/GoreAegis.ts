import Func from '../Func'
import ITrigger from '../Interfaces/Itrigger'
import BoneArmour from '../Objects/Effects/BoneArmour'
import BoneArmourExplosion from '../Objects/Effects/BoneArmourExplosion'
import Character from '../Objects/src/Character'
import Status from './Status'

export default class GoreAegis extends Status implements ITrigger {
    name: string
    effect: any
    count: number = 0
    cd: number = 0
    last_trigger_time: number = 0
    chance: number = 100
    description: string = 'you fires bones when get hit and get armour'

    constructor(
        public time: number,
        start_count: number = 1
    ) {
        super(time)
        this.name = 'gore aegis'
        this.count = start_count
    }

    getTriggerChance(): number {
        return this.chance
    }

    isExpired(tick_time: number) {
        if (this.count === 0) {
            return true
        }

        return tick_time - this.time >= this.duration
    }

    apply(unit: any) {
        this.unit = unit

        if (this.unit instanceof Character) {
            this.unit.armour_rate += 5

            this.unit.newStatus({
                name: 'gore aegis',
                duration: undefined,
                desc: 'you fires bones when get hit and get armour',
            })

            this.unit.level.addSound('bone cast', this.unit.x, this.unit.y)

            this.unit.triggers_on_get_hit.push(this)
            let effect = new BoneArmour(this.unit.level)
            effect.setOwner(this.unit)
            this.effect = effect

            this.unit.level.binded_effects.push(this.effect)
        }
    }

    update(status: any): void {
        if (status instanceof GoreAegis) {
            if (status.count > 0 && this.unit instanceof Character) {
                this.unit.newStatus({
                    name: 'gore aegis',
                    duration: undefined,
                    desc: 'you fires bones when get hit and get armour',
                })
                this.count += status.count
                this.time = Date.now()
            }
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.armour_rate -= 5

            if (this.effect) {
                this.effect.delete()
            }

            this.unit.emitStatusEnd(this.name)
            this.unit.triggers_on_get_hit = this.unit.triggers_on_get_hit.filter(
                elem => elem != this
            )
        }
    }

    trigger() {
        if (!this.unit) return
        this.count--

        let e = new BoneArmourExplosion(this.unit.level)
        e.setPoint(this.unit.x, this.unit.y)
        this.unit.level.effects.push(e)

        this.unit.level.enemies.forEach(elem => {
            if (Func.distance(elem, this.unit) <= 12) {
                elem.takeDamage(this.unit, {})
            }
        })
    }
}
