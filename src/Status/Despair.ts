import ITrigger from '../Interfaces/Itrigger'
import Character from '../Objects/src/Character'
import Status from './Status'

export default class Despair extends Status implements ITrigger {
    name: string
    cd: number = 0
    last_trigger_time: number = 0
    chance: number = 100

    constructor(public time: number) {
        super(time)
        this.name = 'despair'
        this.need_to_check_resist = true
    }

    getTriggerChance(): number {
        return this.chance
    }

    apply(unit: any) {
        this.unit = unit
        if (this.unit instanceof Character) {
            this.unit.triggers_on_get_hit.push(this)

            this.unit.statusWasApplied()

            this.unit.newStatus({
                name: 'despair',
                duration: this.duration,
                desc: 'lose resourse when get damage',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.triggers_on_get_hit = this.unit.triggers_on_get_hit.filter(
                elem => elem != this
            )
        }
    }

    update(status: any) {
        this.time = Date.now()

        this.unit.newStatus({
            name: 'despair',
            duration: this.duration,
            desc: 'lose resourse when get damage',
        })
    }

    trigger() {
        this.unit.resource = 0
    }
}
