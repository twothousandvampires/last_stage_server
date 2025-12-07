import Character from '../Objects/src/Character'
import Status from './Status'

export default class Crushed extends Status {
    name: string

    constructor(public time: number) {
        super(time)
        this.name = 'crushed'
        this.need_to_check_resist = true
    }

    apply(unit: any) {
        this.unit = unit
        if (this.unit instanceof Character) {
            this.unit.statusWasApplied()

            this.unit.chance_to_block -= 30
            this.unit.armour_rate -= 30

            this.unit.newStatus({
                name: 'crushed',
                duration: this.duration,
                desc: 'armour and block chance are reduced',
            })
        }
    }

    clear() {
        if (this.unit instanceof Character) {
            this.unit.chance_to_block += 30
            this.unit.armour_rate += 30
        }
    }

    update(status: any) {
        this.time = Date.now()

        this.unit.newStatus({
            name: 'crushed',
            duration: this.duration,
            desc: 'armour and block chance are reduced',
        })
    }
}
